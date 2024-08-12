import { afterNextRender, Component, inject, OnDestroy, signal } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { IGetCustomer, IGetServices } from '../../interfaces';
import { forkJoin, Subject, takeUntil, tap } from 'rxjs';
import { ReservationService } from '../../services/reservation.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

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

  protected servicesOpt = signal<IGetServices[]>([]);
  protected customerOpt = signal<IGetCustomer[]>([]);
  protected oFormGroup = this._fb.group({
    date:  ['', []],
    customer: ['', []],
    service: ['', []],
  });
  private destroy$ = new Subject<void>();

  constructor(){
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
