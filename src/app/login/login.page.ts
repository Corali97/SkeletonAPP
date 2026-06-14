import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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
import { AnimationController } from '@ionic/angular';
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
export class LoginPage implements AfterViewInit {
  @ViewChild('brandMark', { read: ElementRef }) private brandMark?: ElementRef<HTMLElement>;

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    goal: [3, [Validators.required]]
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly workoutService: WorkoutService,
    private readonly animationController: AnimationController
  ) {
    addIcons({ arrowForwardOutline, barbellOutline });
  }

  ngAfterViewInit(): void {
    if (!this.brandMark?.nativeElement) {
      return;
    }

    this.animationController
      .create()
      .addElement(this.brandMark.nativeElement)
      .duration(900)
      .iterations(1)
      .fromTo('transform', 'scale(0.85) rotate(-6deg)', 'scale(1) rotate(0deg)')
      .fromTo('opacity', '0.4', '1')
      .play();
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
