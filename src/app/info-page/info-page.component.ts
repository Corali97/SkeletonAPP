import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonContent,
    IonHeader,
    IonIcon,
    IonTitle,
    IonToolbar
  ]
})
export class InfoPageComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) subtitle = '';
  @Input({ required: true }) points: string[] = [];

  constructor() {
    addIcons({ arrowBackOutline });
  }
}

@Component({
  selector: 'app-problematica',
  template: `
    <app-info-page
      title="Problematica"
      subtitle="Organizacion personal"
      [points]="points"
    ></app-info-page>
  `,
  standalone: true,
  imports: [InfoPageComponent]
})
export class ProblematicaPage {
  readonly points = [
    'Muchos usuarios no registran sus datos personales de forma ordenada.',
    'La aplicacion resuelve el primer flujo solicitado: Login, Home y formulario validado.',
    'El proyecto sirve como base para continuar creciendo durante la asignatura.'
  ];
}

@Component({
  selector: 'app-solucion',
  template: `
    <app-info-page
      title="Solucion"
      subtitle="SkeletonAPP Ionic Angular"
      [points]="points"
    ></app-info-page>
  `,
  standalone: true,
  imports: [InfoPageComponent]
})
export class SolucionPage {
  readonly points = [
    'Login principal con usuario y password validada.',
    'Home recibe el usuario mediante NavigationExtras y muestra datos adicionales.',
    'Formulario con Angular Material Datepicker y mensaje emergente.'
  ];
}

@Component({
  selector: 'app-componentes',
  template: `
    <app-info-page
      title="Componentes"
      subtitle="Ionic y Angular Material"
      [points]="points"
    ></app-info-page>
  `,
  standalone: true,
  imports: [InfoPageComponent]
})
export class ComponentesPage {
  readonly points = [
    'ion-input, ion-select, ion-button, ion-card, ion-alert e ion-toolbar.',
    'MatDatepicker reemplaza el input ionico de fecha de nacimiento.',
    'Las etiquetas descriptivas se mantienen sobre cada input.'
  ];
}

@Component({
  selector: 'app-funciones',
  template: `
    <app-info-page
      title="Funciones"
      subtitle="Navegacion y animaciones"
      [points]="points"
    ></app-info-page>
  `,
  standalone: true,
  imports: [InfoPageComponent]
})
export class FuncionesPage {
  readonly points = [
    'Validar Login antes de entrar al Home.',
    'Limpiar campos y animar Nombre/Apellido durante 1 segundo.',
    'Mostrar nombre y apellido en un mensaje emergente.'
  ];
}
