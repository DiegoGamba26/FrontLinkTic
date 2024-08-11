import type { Routes } from '@angular/router';

const CONFIGURATION_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./../pages/login/login.component').then(m => m.LoginComponent),
    title: 'Login | Front-end',
  },
  {
    path: 'login',
    pathMatch: 'full',
    redirectTo: ''
},
{
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
},
];

export default CONFIGURATION_ROUTES;
