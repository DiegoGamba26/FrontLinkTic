import { afterNextRender, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {DateAdapter, MatNativeDateModule} from '@angular/material/core';
import { IGetCustomer, IGetServices } from '../../interfaces';
import { forkJoin, Subject, takeUntil, tap } from 'rxjs';
import { ReservationService } from '../../services/reservation.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { IPostReservation } from '../../interfaces/reservation.interface';
import { AlertsService } from '../../../../shared/services/alerts.service';
import { parsearYYMMDD } from '../../../../core/utils/parse-yyyy-mm-dd.function';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-create-reservation',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './create-reservation.component.html',
  styleUrl: './create-reservation.component.scss'
})
export class CreateReservationComponent implements OnInit, OnDestroy{
  private readonly _reservationSvc = inject(ReservationService);
  private readonly _fb = inject(FormBuilder);
  private readonly _alertsS = inject(AlertsService);
  private readonly _adapter = inject(DateAdapter<Date>);
  private readonly activatedRoute = inject(ActivatedRoute);

  protected servicesOpt = signal<IGetServices[]>([]);
  protected customerOpt = signal<IGetCustomer[]>([]);
  protected oFormGroup = this._fb.group({
    date:  [new Date(), []],
    customer: [0, []],
    service: [0, []],
  });
  private destroy$ = new Subject<void>();
  protected idReservationEdit = signal('');
  constructor(){
    this._adapter.setLocale("en-GB")
  }

  ngOnInit(): void {
    this.getDataOptions();
  }

  private getReservationById(){
    const params = new HttpParams().set('reservationId', this.idReservationEdit());
    this._reservationSvc.getReservationById(params).subscribe({
      next:(oRes)=>{
        this.oFormGroup.controls.date.setValue(new Date(oRes.createdAt));
        this.oFormGroup.controls.customer.setValue(oRes.customerId);
        this.oFormGroup.controls.service.setValue(oRes.serviceId);
      }
    })
  }

  private getDataOptions(){
    forkJoin({
      customer: this._reservationSvc.getCustomer(),
      services: this._reservationSvc.getService(),
    }).pipe(
      tap(({ customer, services }) => {
        this.customerOpt.set(customer.data);
        this.servicesOpt.set(services.data);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: ()=>{
        const id = this.activatedRoute.snapshot.queryParams['id'];
      if(id){
        this.idReservationEdit.set(id);
        this.getReservationById()
      }
      }
    });
  }

  protected updateReservation(){
    const data: IPostReservation = {
      customerId: Number(this.oFormGroup.controls.customer.value),
      serviceId: Number(this.oFormGroup.controls.service.value),
      reservationDate: parsearYYMMDD(new Date(String(this.oFormGroup.controls.date.value))),
      status: 'true'
    };
    this._reservationSvc.putReservation(this.idReservationEdit(),data).subscribe({
      next: ()=>{
        this._alertsS.alertSuccess(`Se ha actualizado correctamente la reservacion`,``);
        this.oFormGroup.reset();
      }
    });
  }
  protected createReservation(){
    const data: IPostReservation = {
      customerId: Number(this.oFormGroup.controls.customer.value),
      serviceId: Number(this.oFormGroup.controls.service.value),
      reservationDate: parsearYYMMDD(new Date(String(this.oFormGroup.controls.date.value))),
      status: 'true'
    };
    this._reservationSvc.postReservation(data).subscribe({
      next: ()=>{
        this._alertsS.alertSuccess(`Se ha creado correctamente la reservacion`,``);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
