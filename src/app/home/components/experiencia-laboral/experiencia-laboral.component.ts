import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonCheckbox,
  IonIcon,
  IonInput,
  IonItem,
  IonList
} from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { saveOutline } from 'ionicons/icons';

import { AppDataService } from '../../../services/app-data.service';

@Component({
  selector: 'app-experiencia-laboral',
  templateUrl: './experiencia-laboral.component.html',
  styleUrls: ['./experiencia-laboral.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonButton,
    IonCheckbox,
    IonIcon,
    IonInput,
    IonItem,
    IonList
  ]
})
export class ExperienciaLaboralComponent {
  readonly form = this.formBuilder.nonNullable.group({
    empresa: [this.appDataService.getWorkExperience().empresa, [Validators.required]],
    anioInicio: [this.appDataService.getWorkExperience().anioInicio, [Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
    trabajaActualmente: [this.appDataService.getWorkExperience().trabajaActualmente],
    anioTermino: [this.appDataService.getWorkExperience().anioTermino],
    cargo: [this.appDataService.getWorkExperience().cargo, [Validators.required]]
  });

  constructor(
    private readonly alertController: AlertController,
    private readonly appDataService: AppDataService,
    private readonly formBuilder: FormBuilder
  ) {
    addIcons({ saveOutline });
  }

  async guardar(): Promise<void> {
    const trabajaActualmente = this.form.controls.trabajaActualmente.value;
    const anioTermino = this.form.controls.anioTermino.value;

    if (!trabajaActualmente && !/^[0-9]{4}$/.test(anioTermino)) {
      this.form.controls.anioTermino.setErrors({ required: true });
    } else {
      this.form.controls.anioTermino.setErrors(null);
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const alert = await this.alertController.create({
        header: 'Datos incompletos',
        message: 'Completa empresa, año de inicio, cargo y año de término si ya no trabajas ahi.',
        buttons: ['Aceptar']
      });
      await alert.present();
      return;
    }

    const data = this.form.getRawValue();
    this.appDataService.saveWorkExperience({
      ...data,
      anioTermino: data.trabajaActualmente ? '' : data.anioTermino
    });

    const alert = await this.alertController.create({
      header: 'Experiencia guardada',
      cssClass: 'datos-alert',
      message: [
        `Empresa: ${data.empresa}`,
        `Cargo: ${data.cargo}`,
        `Año inicio: ${data.anioInicio}`,
        `Año término: ${data.trabajaActualmente ? 'Trabajo actual' : data.anioTermino}`
      ].join('\n'),
      buttons: ['Aceptar']
    });
    await alert.present();
  }
}
