import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'welcome',
    loadComponent: () => import('./pages/welcome/welcome.page').then( m => m.WelcomePage)
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./pages/sign-up/sign-up.page').then( m => m.SignUpPage)
  },
  {
    path: 'add-location',
    loadComponent: () => import('./pages/add-location/add-location.page').then( m => m.AddLocationPage)
  },
 
  {
    path: 'search-location',
    loadComponent: () => import('./pages/search-location/search-location.page').then( m => m.SearchLocationPage)
  },
];
