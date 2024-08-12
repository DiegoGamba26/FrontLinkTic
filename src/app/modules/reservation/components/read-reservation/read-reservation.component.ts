import { afterNextRender, Component, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';

import { IGetReservation } from '../../interfaces/reservation.interface';
import { AlertsService } from '../../../../shared/services/alerts.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IGetCustomer, IGetServices } from '../../interfaces';
import { forkJoin, Subject, takeUntil, tap } from 'rxjs';
import { ReservationService } from '../../services/reservation.service';
import { HttpParams } from '@angular/common/http';
import { isNotEmpty } from '../../../../core/utils/isNotEmpty.function';

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
  ],
  templateUrl: './read-reservation.component.html',
  styleUrl: './read-reservation.component.scss'
})
export class ReadReservationComponent {
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
  protected displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'actions'];
  protected oFormGroup = this._fb.group({
    rangeDate: this._fb.group({
      end: ['', []],
      start: ['', []]
    }),
    customer: ['', []],
    service: ['', []],
  });

constructor(){
    afterNextRender(() => {
      this.getDataOptions();
      this.getData();
    });
  }

  private getData(){
    this._alertsS.alertLoading();
    let params = new HttpParams();
    if(isNotEmpty(this.oFormGroup.controls.rangeDate.value.start)) params.set('startDate', String(this.oFormGroup.controls.rangeDate.value.start));
    if(isNotEmpty(this.oFormGroup.controls.rangeDate.value.end)) params.set('endDate', String(this.oFormGroup.controls.rangeDate.value.end));
    if(isNotEmpty(this.oFormGroup.controls.customer.value)) params.set('customerId', String(this.oFormGroup.controls.customer.value));
    if(isNotEmpty(this.oFormGroup.controls.service.value)) params.set('customerId', String(this.oFormGroup.controls.service.value));
    this._reservationSvc.getReservations(params).subscribe({
      next: ()=>{
        this._alertsS.closeAlert();
      },
      error: ()=>{this._alertsS.closeAlert();}
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
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
