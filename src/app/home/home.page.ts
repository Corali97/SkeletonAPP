import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { AnimationController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  barbellOutline,
  briefcaseOutline,
  cameraOutline,
  documentTextOutline,
  logOutOutline,
  mapOutline,
  personOutline,
  schoolOutline
} from 'ionicons/icons';

import { CertificacionesComponent } from './components/certificaciones/certificaciones.component';
import { ExperienciaLaboralComponent } from './components/experiencia-laboral/experiencia-laboral.component';
import { MisDatosComponent } from './components/mis-datos/mis-datos.component';
import { AppDataService } from '../services/app-data.service';
import { DBTaskService } from '../services/dbtask.service';

type HomeSegment = 'mis-datos' | 'experiencia' | 'certificaciones';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CertificacionesComponent,
    ExperienciaLaboralComponent,
    MisDatosComponent,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonContent,
    IonHeader,
    IonIcon,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonTitle,
    IonToolbar
  ]
})
export class HomePage implements AfterViewInit {
  @ViewChild('homeTitle', { read: ElementRef }) private homeTitle?: ElementRef<HTMLElement>;

  usuario = 'Usuario';
  selectedSegment: HomeSegment = 'mis-datos';

  constructor(
    private readonly animationController: AnimationController,
    private readonly appDataService: AppDataService,
    private readonly dbTaskService: DBTaskService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    addIcons({
      barbellOutline,
      briefcaseOutline,
      cameraOutline,
      documentTextOutline,
      logOutOutline,
      mapOutline,
      personOutline,
      schoolOutline
    });

    this.usuario = this.router.getCurrentNavigation()?.extras.state?.['usuario']
      ?? history.state?.usuario
      ?? this.dbTaskService.getActiveSession()?.user_name
      ?? this.appDataService.user
      ?? this.usuario;

    this.route.queryParamMap.subscribe((params) => {
      this.usuario = params.get('usuario') ?? this.usuario;
    });
  }

  ngAfterViewInit(): void {
    if (!this.homeTitle?.nativeElement) {
      return;
    }

    this.animationController
      .create()
      .addElement(this.homeTitle.nativeElement)
      .duration(1000)
      .iterations(1)
      .fromTo('transform', 'translateX(-18px)', 'translateX(0)')
      .fromTo('opacity', '0.35', '1')
      .play();
  }

  setSegment(value: string | number | undefined): void {
    if (value === 'mis-datos' || value === 'experiencia' || value === 'certificaciones') {
      this.selectedSegment = value;
    }
  }

  logout(): void {
    this.dbTaskService.logout();
    this.appDataService.clearUser();
    void this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
