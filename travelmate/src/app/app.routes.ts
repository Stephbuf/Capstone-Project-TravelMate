import { Routes } from '@angular/router';

export const routes: Routes = [
 
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
  {
    path: 'welcome',
    loadComponent: () =>
      import('./pages/welcome/welcome.page').then((m) => m.WelcomePage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./pages/sign-up/sign-up.page').then((m) => m.SignUpPage),
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'add-location',
    loadComponent: () =>
      import('./pages/add-location/add-location.page').then((m) => m.AddLocationPage),
  },
  {
    path: 'search-location',
    loadComponent: () =>
      import('./pages/search-location/search-location.page').then((m) => m.SearchLocationPage),
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./pages/wishlist/wishlist.page').then( m => m.WishlistPage)
  },
  {
    path: 'itinerary',
    loadComponent: () => import('./pages/itinerary/itinerary.page').then( m => m.ItineraryPage)
  },
  {
    path: 'itinerarycategories',
    loadComponent: () => import('./pages/itinerarycategories/itinerarycategories.page').then( m => m.ItineraryCategoriesPage)
  },
  {
    path: 'wishlistcategories',
    loadComponent: () => import('./pages/wishlistcategories/wishlistcategories.page').then( m => m.WishlistCategoriesPage)
  },
];
