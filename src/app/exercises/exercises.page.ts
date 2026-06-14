import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, arrowBackOutline, barbellOutline, bodyOutline, checkmarkOutline, pulseOutline, walkOutline } from 'ionicons/icons';

import { AppDataService, Exercise, ExerciseCategory } from '../services/app-data.service';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.page.html',
  styleUrls: ['./exercises.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonButton,
    IonButtons,
    IonCard,
    IonChip,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar
  ]
})
export class ExercisesPage {
  readonly categories = this.appDataService.categories;
  readonly categoryLabels = this.appDataService.categoryLabels;

  exercises: Exercise[] = this.appDataService.getExercises();
  completedIds: string[] = this.appDataService.getCompletedIds();
  newExerciseName = '';
  newExerciseCategory: ExerciseCategory = 'gluteos';

  constructor(private readonly appDataService: AppDataService) {
    addIcons({ addOutline, arrowBackOutline, barbellOutline, bodyOutline, checkmarkOutline, pulseOutline, walkOutline });
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
    this.appDataService.toggleCompleted(exerciseId);
    this.completedIds = this.appDataService.getCompletedIds();
  }

  addExercise(): void {
    const name = this.newExerciseName.trim();

    if (!name) {
      return;
    }

    this.appDataService.addExercise(name, this.newExerciseCategory);
    this.exercises = this.appDataService.getExercises();
    this.newExerciseName = '';
  }
}
