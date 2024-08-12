import { afterNextRender, Component, inject, signal, viewChild } from '@angular/core';

import {
  MatTabChangeEvent,
  MatTabGroup,
  MatTabsModule,
} from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CreateReservationComponent } from '../../components/create-reservation/create-reservation.component';
import { ReadReservationComponent } from '../../components/read-reservation/read-reservation.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    MatTabsModule,
    CreateReservationComponent,
    ReadReservationComponent,
    RouterModule,
    HeaderComponent,
  ],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss'
})
export class ReservationsComponent {
  protected tabGroup = viewChild.required<MatTabGroup>('myTabGroup');
  protected type = signal(0);
  protected idUserEdit = signal(0);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly route = inject(Router);

  constructor() {
    afterNextRender(() => {
      this.processTab();
    });
  }

  private processTab() {
    this.activatedRoute.queryParamMap.subscribe(params => {
      if (params.get('type')) {
        this.type.set(Number(params.get('type')));
        this.selectTab();
      }
      if (params.get('id')) {
        this.idUserEdit.set(Number(params.get('id')));
        this.selectTab();
      }
    });
  }

  private selectTab() {
    if (this.type() === 0) {
      this.tabGroup().selectedIndex = 0;
    }
    if (this.type() === 1) {
      this.tabGroup().selectedIndex = 1;
    }
  }

  protected changeTab(event: MatTabChangeEvent) {
    const params: { type: string; id?: string } = {
      type: '',
    };
    if (event.index === 0) {
      this.type.set(0);
      this.idUserEdit.set(0);
    }
    if (event.index === 1) {
      this.type.set(1);
    }
    params.type = String(this.type());
    if (this.idUserEdit() !== 0) params.id = String(this.idUserEdit());
    this.route.navigate(['/reservation/home'], {
      queryParams: params,
    });
  }
}
