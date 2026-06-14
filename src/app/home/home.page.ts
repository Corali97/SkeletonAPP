import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonNote,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { AnimationController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  barbellOutline,
  calendarOutline,
  fitnessOutline,
  logOutOutline,
  personOutline,
  statsChartOutline
} from 'ionicons/icons';

import { WorkoutService } from '../services/workout.service';

interface HomeShortcut {
  title: string;
  note: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
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
    IonLabel,
    IonNote,
    IonTitle,
    IonToolbar
  ]
})
export class HomePage implements AfterViewInit {
  @ViewChild('heroCard', { read: ElementRef }) private heroCard?: ElementRef<HTMLElement>;

  readonly shortcuts: HomeShortcut[] = [
    { title: 'Rutina diaria', note: 'Marca tus ejercicios de hoy', icon: 'calendar-outline', route: '/rutina' },
    { title: 'Ejercicios', note: 'Agrega y clasifica rutinas', icon: 'barbell-outline', route: '/ejercicios' },
    { title: 'Progreso', note: 'Revisa tu avance semanal', icon: 'stats-chart-outline', route: '/progreso' },
    { title: 'Perfil', note: 'Completa tus datos personales', icon: 'person-outline', route: '/perfil' }
  ];

  constructor(
    private readonly animationController: AnimationController,
    private readonly router: Router,
    private readonly workoutService: WorkoutService
  ) {
    addIcons({
      barbellOutline,
      calendarOutline,
      fitnessOutline,
      logOutOutline,
      personOutline,
      statsChartOutline
    });
  }

  ngAfterViewInit(): void {
    if (!this.heroCard?.nativeElement) {
      return;
    }

    this.animationController
      .create()
      .addElement(this.heroCard.nativeElement)
      .duration(900)
      .iterations(1)
      .fromTo('transform', 'translateY(20px)', 'translateY(0)')
      .fromTo('opacity', '0.2', '1')
      .play();
  }

  get userName(): string {
    return this.workoutService.user?.name ?? 'Usuario';
  }

  get weeklyGoal(): number {
    return this.workoutService.user?.goal ?? 3;
  }

  logout(): void {
    this.workoutService.logout();
    void this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
