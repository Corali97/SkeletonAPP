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
    path: 'problematica',
    loadComponent: () => import('./info-page/info-page.component').then((m) => m.ProblematicaPage)
  },
  {
    path: 'solucion',
    loadComponent: () => import('./info-page/info-page.component').then((m) => m.SolucionPage)
  },
  {
    path: 'componentes',
    loadComponent: () => import('./info-page/info-page.component').then((m) => m.ComponentesPage)
  },
  {
    path: 'funciones',
    loadComponent: () => import('./info-page/info-page.component').then((m) => m.FuncionesPage)
  }
];
