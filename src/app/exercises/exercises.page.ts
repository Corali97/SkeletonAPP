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
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, arrowBackOutline } from 'ionicons/icons';

import { Exercise, ExerciseCategory, WorkoutService } from '../services/workout.service';

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
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar
  ]
})
export class ExercisesPage {
  readonly categories = this.workoutService.categories;
  readonly categoryLabels = this.workoutService.categoryLabels;

  newExerciseName = '';
  newExerciseCategory: ExerciseCategory = 'gluteos';

  constructor(private readonly workoutService: WorkoutService) {
    addIcons({ addOutline, arrowBackOutline });
  }

  get exercises(): Exercise[] {
    return this.workoutService.exercises;
  }

  exercisesByCategory(category: ExerciseCategory): Exercise[] {
    return this.exercises.filter((exercise) => exercise.category === category);
  }

  addExercise(): void {
    const name = this.newExerciseName.trim();

    if (!name) {
      return;
    }

    this.workoutService.addExercise(name, this.newExerciseCategory);
    this.newExerciseName = '';
  }
}
