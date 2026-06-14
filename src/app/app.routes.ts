import { Routes } from '@angular/router';

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
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage)
  },
  {
    path: 'rutina',
    loadComponent: () => import('./routine/routine.page').then((m) => m.RoutinePage)
  },
  {
    path: 'ejercicios',
    loadComponent: () => import('./exercises/exercises.page').then((m) => m.ExercisesPage)
  },
  {
    path: 'progreso',
    loadComponent: () => import('./progress/progress.page').then((m) => m.ProgressPage)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./profile/profile.page').then((m) => m.ProfilePage)
  }
];
