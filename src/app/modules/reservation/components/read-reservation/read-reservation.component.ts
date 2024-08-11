import { Component, inject, viewChild } from '@angular/core';
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
  private readonly _alertsS = inject(AlertsService);
  private readonly iRouter = inject(Router);
  private readonly _fb = inject(FormBuilder);

  protected panelOpenState = true;
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
}
