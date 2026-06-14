import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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

import { WorkoutService } from '../services/workout.service';

interface WeekProgress {
  label: string;
  height: number;
}

@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
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
export class ProgressPage implements OnInit {
  weekProgress: WeekProgress[] = [];

  constructor(
    private readonly router: Router,
    private readonly workoutService: WorkoutService
  ) {
    addIcons({ arrowBackOutline });
  }

  ngOnInit(): void {
    if (!this.workoutService.user) {
      void this.router.navigateByUrl('/login');
      return;
    }

    this.refresh();
  }

  get weeklyGoal(): number {
    return this.workoutService.user?.goal ?? 3;
  }

  get completedDays(): number {
    return this.weekProgress.filter((day) => day.height > 0).length;
  }

  get completedToday(): number {
    return this.workoutService.getCompletedIds().length;
  }

  get progressPercent(): number {
    const routineSize = this.workoutService.getDailyRoutine().length;
    return routineSize ? Math.round((this.completedToday / routineSize) * 100) : 0;
  }

  get ringOffset(): number {
    return 302 - (302 * this.progressPercent) / 100;
  }

  resetWeek(): void {
    this.workoutService.resetWeek();
    this.refresh();
  }

  private refresh(): void {
    this.weekProgress = this.buildWeekProgress();
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
