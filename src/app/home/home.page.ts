import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  barbellOutline,
  bodyOutline,
  checkmarkOutline,
  logOutOutline,
  pulseOutline,
  walkOutline
} from 'ionicons/icons';

import { Exercise, ExerciseCategory, WorkoutService } from '../services/workout.service';

interface WeekProgress {
  label: string;
  height: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonChip,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonSegment,
    IonSegmentButton,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar
  ]
})
export class HomePage implements OnInit {
  readonly categories = this.workoutService.categories;
  readonly categoryLabels = this.workoutService.categoryLabels;

  activePanel = 'routine';
  routine: Exercise[] = [];
  exercises: Exercise[] = [];
  completedIds: string[] = [];
  newExerciseName = '';
  newExerciseCategory: ExerciseCategory = 'gluteos';
  completedTotal = 0;
  progressPercent = 0;
  weekProgress: WeekProgress[] = [];
  completedDays = 0;

  constructor(
    private readonly router: Router,
    private readonly workoutService: WorkoutService
  ) {
    addIcons({
      addOutline,
      barbellOutline,
      bodyOutline,
      checkmarkOutline,
      logOutOutline,
      pulseOutline,
      walkOutline
    });
  }

  ngOnInit(): void {
    if (!this.workoutService.user) {
      void this.router.navigateByUrl('/login');
      return;
    }

    this.refresh();
  }

  get userName(): string {
    return this.workoutService.user?.name ?? '';
  }

  get weeklyGoal(): number {
    return this.workoutService.user?.goal ?? 3;
  }

  get todayLabel(): string {
    return new Intl.DateTimeFormat('es-CL', {
      weekday: 'long',
      day: 'numeric',
      month: 'short'
    }).format(new Date());
  }

  get ringOffset(): number {
    return 302 - (302 * this.progressPercent) / 100;
  }

  logout(): void {
    this.workoutService.logout();
    void this.router.navigateByUrl('/login');
  }

  exercisesByCategory(category: ExerciseCategory): Exercise[] {
    return this.exercises.filter((exercise) => exercise.category === category);
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

  addExercise(): void {
    const name = this.newExerciseName.trim();

    if (!name) {
      return;
    }

    this.workoutService.addExercise(name, this.newExerciseCategory);
    this.newExerciseName = '';
    this.refresh();
  }

  resetWeek(): void {
    this.workoutService.resetWeek();
    this.refresh();
  }

  private refresh(): void {
    this.exercises = this.workoutService.exercises;
    this.routine = this.workoutService.getDailyRoutine();
    this.completedIds = this.workoutService.getCompletedIds();
    this.completedTotal = this.routine.filter((exercise) => this.isCompleted(exercise.id)).length;
    this.progressPercent = this.routine.length
      ? Math.round((this.completedTotal / this.routine.length) * 100)
      : 0;
    this.weekProgress = this.buildWeekProgress();
    this.completedDays = this.weekProgress.filter((day) => day.height > 0).length;
  }

  private buildWeekProgress(): WeekProgress[] {
    const labels = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

    return this.workoutService.currentWeekKeys().map((dateKey) => {
      const date = new Date(`${dateKey}T12:00:00`);
      const completed = this.workoutService.getCompletedIds(dateKey).length;

      return {
        label: labels[date.getDay()],
        height: Math.min(100, completed * 25)
      };
    });
  }
}
