import { Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage)
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage)
  },
  {
    path: 'ejercicios',
    canActivate: [authGuard],
    loadComponent: () => import('./exercises/exercises.page').then((m) => m.ExercisesPage)
  },
  {
    path: 'progreso',
    canActivate: [authGuard],
    loadComponent: () => import('./progress/progress.page').then((m) => m.ProgressPage)
  },
  {
    path: 'mapa',
    canActivate: [authGuard],
    loadComponent: () => import('./mapa/mapa.page').then((m) => m.MapaPage)
  },
  {
    path: 'camara',
    canActivate: [authGuard],
    loadComponent: () => import('./camara/camara.page').then((m) => m.CamaraPage)
  },
  {
    path: '404',
    loadComponent: () => import('./not-found/not-found.page').then((m) => m.NotFoundPage)
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found.page').then((m) => m.NotFoundPage)
  }
];
