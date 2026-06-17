import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
import { locateOutline, stopCircleOutline } from 'ionicons/icons';

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
  mapUrl?: SafeResourceUrl;
  statusMessage = 'Esperando permiso de ubicacion.';
  private watchId?: number;

  constructor(private readonly sanitizer: DomSanitizer) {
    addIcons({ locateOutline, stopCircleOutline });
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
    this.statusMessage = 'Obteniendo ubicacion en tiempo real...';
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.accuracy = position.coords.accuracy;
        this.statusMessage = 'Ubicacion actualizada.';
        this.updateMap();
      },
      () => {
        this.statusMessage = 'No se pudo obtener la ubicacion. Revisa permisos del navegador o telefono.';
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000
      }
    );
  }

  stopLocation(): void {
    if (this.watchId !== undefined) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = undefined;
    }
  }

  private updateMap(): void {
    const delta = 0.01;
    const url = `https://www.openstreetmap.org/export/embed.html?bbox=${this.longitude - delta}%2C${this.latitude - delta}%2C${this.longitude + delta}%2C${this.latitude + delta}&layer=mapnik&marker=${this.latitude}%2C${this.longitude}`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
