import { afterNextRender, Component, inject, OnDestroy, signal } from '@angular/core';

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
export class CreateReservationComponent implements OnDestroy{
  private readonly _reservationSvc = inject(ReservationService);
  private readonly _fb = inject(FormBuilder);
  private readonly _alertsS = inject(AlertsService);
  private readonly _adapter = inject(DateAdapter<Date>);

  protected servicesOpt = signal<IGetServices[]>([]);
  protected customerOpt = signal<IGetCustomer[]>([]);
  protected oFormGroup = this._fb.group({
    date:  [new Date(), []],
    customer: ['', []],
    service: ['', []],
  });
  private destroy$ = new Subject<void>();

  constructor(){
    this._adapter.setLocale("en-GB")
    afterNextRender(() => {
      this.getDataOptions();
    });
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
    ).subscribe();
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
        this.oFormGroup.reset();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
