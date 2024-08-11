import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./modules/auth/routes/auth.routes'),
    },
    {
        path: 'reservation',
        loadChildren: () => import('./modules/reservation/routes/reservation.routes'),
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'auth'
    },
    {
        path: '**',
        redirectTo: 'auth',
        pathMatch: 'full',
    },
];
