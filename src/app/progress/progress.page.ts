import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

import { AppDataService } from '../services/app-data.service';

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

  constructor(private readonly appDataService: AppDataService) {
    addIcons({ arrowBackOutline });
  }

  ngOnInit(): void {
    this.refresh();
  }

  get completedToday(): number {
    return this.appDataService.getCompletedIds().length;
  }

  get progressPercent(): number {
    const routineSize = this.appDataService.getDailyRoutine().length;
    return routineSize ? Math.round((this.completedToday / routineSize) * 100) : 0;
  }

  get completedDays(): number {
    return this.weekProgress.filter((day) => day.height > 0).length;
  }

  get ringOffset(): number {
    return 302 - (302 * this.progressPercent) / 100;
  }

  resetWeek(): void {
    this.appDataService.resetWeek();
    this.refresh();
  }

  private refresh(): void {
    const labels = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    this.weekProgress = this.appDataService.currentWeekKeys().map((dateKey) => {
      const date = new Date(`${dateKey}T12:00:00`);
      const completed = this.appDataService.getCompletedIds(dateKey).length;

      return {
        label: labels[date.getDay()],
        height: Math.min(100, completed * 25)
      };
    });
  }
}
