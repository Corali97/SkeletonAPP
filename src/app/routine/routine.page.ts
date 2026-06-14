import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, barbellOutline, bodyOutline, checkmarkOutline, pulseOutline, walkOutline } from 'ionicons/icons';

import { Exercise, ExerciseCategory, WorkoutService } from '../services/workout.service';

@Component({
  selector: 'app-routine',
  templateUrl: './routine.page.html',
  styleUrls: ['./routine.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonTitle,
    IonToolbar
  ]
})
export class RoutinePage implements OnInit {
  readonly categoryLabels = this.workoutService.categoryLabels;

  routine: Exercise[] = [];
  completedIds: string[] = [];

  constructor(
    private readonly router: Router,
    private readonly workoutService: WorkoutService
  ) {
    addIcons({ arrowBackOutline, barbellOutline, bodyOutline, checkmarkOutline, pulseOutline, walkOutline });
  }

  ngOnInit(): void {
    if (!this.workoutService.user) {
      void this.router.navigateByUrl('/login');
      return;
    }

    this.refresh();
  }

  get completedTotal(): number {
    return this.routine.filter((exercise) => this.isCompleted(exercise.id)).length;
  }

  get todayLabel(): string {
    return new Intl.DateTimeFormat('es-CL', {
      weekday: 'long',
      day: 'numeric',
      month: 'short'
    }).format(new Date());
  }

  categoryIcon(category: ExerciseCategory): string {
    const icons: Record<ExerciseCategory, string> = {
      gluteos: 'body-outline',
      abdomen: 'pulse-outline',
      piernas: 'walk-outline',
      brazos: 'barbell-outline'
    };

    return icons[category];
  }

  isCompleted(exerciseId: string): boolean {
    return this.completedIds.includes(exerciseId);
  }

  toggleCompleted(exerciseId: string): void {
    this.workoutService.toggleCompleted(exerciseId);
    this.refresh();
  }

  private refresh(): void {
    this.routine = this.workoutService.getDailyRoutine();
    this.completedIds = this.workoutService.getCompletedIds();
  }
}
