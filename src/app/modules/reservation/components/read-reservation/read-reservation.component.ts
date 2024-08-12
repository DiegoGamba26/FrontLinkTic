import { afterNextRender, Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatTooltipModule} from '@angular/material/tooltip';

import { IGetReservation, Reservation } from '../../interfaces/reservation.interface';
import { AlertsService } from '../../../../shared/services/alerts.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IGetCustomer, IGetServices } from '../../interfaces';
import { forkJoin, Subject, takeUntil, tap } from 'rxjs';
import { ReservationService } from '../../services/reservation.service';
import { HttpParams } from '@angular/common/http';
import { isNotEmpty } from '../../../../core/utils/isNotEmpty.function';
import { parsearYYMMDD } from '../../../../core/utils/parse-yyyy-mm-dd.function';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-read-reservation',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DatePipe,
    MatTooltipModule,
  ],
  templateUrl: './read-reservation.component.html',
  styleUrl: './read-reservation.component.scss'
})
export class ReadReservationComponent implements OnInit{
  protected paginator = viewChild.required<MatPaginator>('matPaginator');
  protected sort = viewChild.required<MatSort>('matSort');
  private readonly _reservationSvc = inject(ReservationService);
  private readonly _alertsS = inject(AlertsService);
  private readonly iRouter = inject(Router);
  private readonly _fb = inject(FormBuilder);

  protected servicesOpt = signal<IGetServices[]>([]);
  protected customerOpt = signal<IGetCustomer[]>([]);
  protected panelOpenState = true;
  private destroy$ = new Subject<void>();
  protected dataSource = new MatTableDataSource<IGetReservation>();
  protected displayedColumns: string[] = ['createdAt', 'firstName', 'lastName', 'phone', 'email', 'serviceName','actions'];
  protected oFormGroup = this._fb.group({
    rangeDate: this._fb.group({
      end: ['', []],
      start: ['', []]
    }),
    customer: ['', []],
    service: ['', []],
  });

  constructor() {}


  ngOnInit(): void {
    this.getDataOptions();
    this.getData();
  }

  protected getData() {
    this._alertsS.alertLoading();
    let params = new HttpParams();
    if (isNotEmpty(String(this.oFormGroup.controls.rangeDate.value.start))) {
      const start = parsearYYMMDD(new Date(String(this.oFormGroup.controls.rangeDate.value.start)))
      params = params.set('startDate',start);
    }
    if (isNotEmpty(String(this.oFormGroup.controls.rangeDate.value.end))) {
      const end = parsearYYMMDD(new Date(String(this.oFormGroup.controls.rangeDate.value.end)))
      params = params.set('endDate', end);
    }
    if (isNotEmpty(this.oFormGroup.controls.customer.value)) {
      params = params.set('customerId', String(this.oFormGroup.controls.customer.value));
    }
    if (isNotEmpty(this.oFormGroup.controls.service.value)) {
      params = params.set('serviceId', String(this.oFormGroup.controls.service.value));
    }
    this._reservationSvc.getReservations(params).subscribe({
      next: (oRes) => {
        this._alertsS.closeAlert();
        this.dataSource.data = oRes.data;
        this.dataSource.paginator = this.paginator();
      },
      error: () => { this._alertsS.closeAlert(); }
    })
  }

  protected handleCancelReservation(reservation: Reservation){
    this._alertsS.alertWarning(`¿Estas seguro de eliminar esta reservación?`,``)
      .then((oRes)=>{
        if(oRes.isConfirmed){
          this.cancelReservation(reservation);
        }
      })
  }

  protected cancelReservation(reservation: Reservation){
    this._reservationSvc.deleteReservation(reservation.reservationId).subscribe({
      next: ()=>{
        this._alertsS.alertSuccess(`Se ha cancelado la reservación correctamente`,``)
          .then(()=>{
              window.location.reload();
          });
      }
    });
  }

  protected onEditReservation(reservation: Reservation) {
    this.iRouter.navigate(['/reservation/home'], {
      queryParams: {
        type: 1,
        id: reservation.reservationId,
      },
    });
  }

  private getDataOptions() {
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
