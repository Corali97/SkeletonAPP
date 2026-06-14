import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { AlertController, AnimationController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { arrowBackOutline, eyeOutline, refreshOutline, saveOutline } from 'ionicons/icons';

import { WorkoutService } from '../services/workout.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonList,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar
  ]
})
export class ProfilePage {
  @ViewChild('firstNameField', { read: ElementRef }) private firstNameField?: ElementRef<HTMLElement>;
  @ViewChild('lastNameField', { read: ElementRef }) private lastNameField?: ElementRef<HTMLElement>;

  readonly educationLevels = ['Basica', 'Media', 'Tecnica', 'Universitaria', 'Postgrado'];

  readonly form = this.formBuilder.nonNullable.group({
    firstName: [this.workoutService.profile.firstName, [Validators.required, Validators.minLength(2)]],
    lastName: [this.workoutService.profile.lastName, [Validators.required, Validators.minLength(2)]],
    educationLevel: [this.workoutService.profile.educationLevel, [Validators.required]],
    birthDate: [this.workoutService.profile.birthDate, [Validators.required]]
  });

  constructor(
    private readonly alertController: AlertController,
    private readonly animationController: AnimationController,
    private readonly formBuilder: FormBuilder,
    private readonly workoutService: WorkoutService
  ) {
    addIcons({ arrowBackOutline, eyeOutline, refreshOutline, saveOutline });
  }

  limpiar(): void {
    this.form.reset({
      firstName: '',
      lastName: '',
      educationLevel: '',
      birthDate: ''
    });
    this.animateNameFields();
  }

  async mostrar(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const alert = await this.alertController.create({
        header: 'Datos incompletos',
        message: 'Completa nombre, apellido, nivel de educacion y fecha de nacimiento.',
        buttons: ['Aceptar']
      });
      await alert.present();
      return;
    }

    const value = this.form.getRawValue();
    this.workoutService.saveProfile(value);

    const alert = await this.alertController.create({
      header: 'Perfil guardado',
      message: `Nombre: ${value.firstName} ${value.lastName}`,
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  private animateNameFields(): void {
    const elements = [this.firstNameField?.nativeElement, this.lastNameField?.nativeElement].filter(
      (element): element is HTMLElement => Boolean(element)
    );

    if (!elements.length) {
      return;
    }

    this.animationController
      .create()
      .addElement(elements)
      .duration(1000)
      .iterations(1)
      .keyframes([
        { offset: 0, transform: 'translateX(0)' },
        { offset: 0.35, transform: 'translateX(18px)' },
        { offset: 0.7, transform: 'translateX(-8px)' },
        { offset: 1, transform: 'translateX(0)' }
      ])
      .play();
  }
}
