import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  IonBackButton,
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
import { locateOutline, mapOutline, stopCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonBackButton,
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
export class MapaPage implements OnInit, OnDestroy {
  latitude = 0;
  longitude = 0;
  accuracy = 0;
  statusMessage = 'Esperando permiso de ubicacion.';
  private watchId?: number;

  constructor() {
    addIcons({ locateOutline, mapOutline, stopCircleOutline });
  }

  get hasLocation(): boolean {
    return this.latitude !== 0 || this.longitude !== 0;
  }

  ngOnInit(): void {
    this.startLocation();
  }

  ionViewWillLeave(): void {
    this.stopLocation();
  }

  ngOnDestroy(): void {
    this.stopLocation();
  }

  startLocation(): void {
    if (!navigator.geolocation) {
      this.statusMessage = 'Geolocalizacion no disponible en este dispositivo.';
      return;
    }

    this.stopLocation();
    this.statusMessage = 'Acepta el permiso de ubicacion para mostrar el marcador.';
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.accuracy = position.coords.accuracy;
        this.statusMessage = 'Ubicacion actualizada en tiempo real.';
      },
      () => {
        this.statusMessage = 'No se pudo obtener la ubicacion. Activa GPS y acepta el permiso.';
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000
      }
    );
  }

  stopLocation(): void {
    if (this.watchId !== undefined) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = undefined;
      this.statusMessage = this.hasLocation ? 'Seguimiento detenido.' : this.statusMessage;
    }
  }
}
