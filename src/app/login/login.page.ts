import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, barbellOutline } from 'ionicons/icons';

import { WorkoutService } from '../services/workout.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonContent,
    IonIcon,
    IonInput,
    IonItem,
    IonList,
    IonSelect,
    IonSelectOption
  ]
})
export class LoginPage {
  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    goal: [3, [Validators.required]]
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly workoutService: WorkoutService
  ) {
    addIcons({ arrowForwardOutline, barbellOutline });
  }

  login(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.workoutService.login({
      name: value.name.trim(),
      goal: Number(value.goal)
    });
    void this.router.navigateByUrl('/home', { replaceUrl: true });
  }
}
