import type { Routes } from '@angular/router';

const CONFIGURATION_ROUTES: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./../pages/reservations/reservations.component').then(m => m.ReservationsComponent),
    title: 'Reservation | Front-end',
  },
];

export default CONFIGURATION_ROUTES;
