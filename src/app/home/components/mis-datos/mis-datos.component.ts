import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';
import { AlertController, AnimationController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { refreshOutline, saveOutline } from 'ionicons/icons';

import { AppDataService } from '../../../services/app-data.service';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    IonButton,
    IonIcon,
    IonInput,
    IonItem,
    IonList,
    IonSelect,
    IonSelectOption
  ]
})
export class MisDatosComponent implements AfterViewInit {
  @ViewChild('nombreField', { read: ElementRef }) private nombreField?: ElementRef<HTMLElement>;
  @ViewChild('apellidoField', { read: ElementRef }) private apellidoField?: ElementRef<HTMLElement>;

  readonly nivelesEducacion = ['Basica', 'Media', 'Tecnica', 'Universitaria', 'Postgrado'];

  readonly form = this.formBuilder.group({
    nombre: [this.appDataService.getHomeData().nombre, [Validators.required, Validators.minLength(2)]],
    apellido: [this.appDataService.getHomeData().apellido, [Validators.required, Validators.minLength(2)]],
    nivelEducacion: [this.appDataService.getHomeData().nivelEducacion, [Validators.required]],
    fechaNacimiento: [
      this.appDataService.getHomeData().fechaNacimiento ? new Date(this.appDataService.getHomeData().fechaNacimiento) : null,
      [Validators.required]
    ]
  });

  constructor(
    private readonly alertController: AlertController,
    private readonly animationController: AnimationController,
    private readonly appDataService: AppDataService,
    private readonly formBuilder: FormBuilder
  ) {
    addIcons({ refreshOutline, saveOutline });
  }

  ngAfterViewInit(): void {
    this.animarCampos();
  }

  limpiar(): void {
    this.form.reset({
      nombre: '',
      apellido: '',
      nivelEducacion: '',
      fechaNacimiento: null
    });
    this.animarCampos();
  }

  async guardar(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const alert = await this.alertController.create({
        header: 'Formulario incompleto',
        message: 'Completa nombre, apellido, nivel de educacion y fecha de nacimiento.',
        buttons: ['Aceptar']
      });
      await alert.present();
      return;
    }

    const datos = this.form.getRawValue();
    const fecha = datos.fechaNacimiento instanceof Date ? datos.fechaNacimiento.toISOString() : '';

    this.appDataService.saveHomeData({
      nombre: datos.nombre ?? '',
      apellido: datos.apellido ?? '',
      nivelEducacion: datos.nivelEducacion ?? '',
      fechaNacimiento: fecha
    });

    const alert = await this.alertController.create({
      header: 'Datos ingresados',
      cssClass: 'datos-alert',
      message: [
        `Nombre: ${datos.nombre}`,
        `Apellido: ${datos.apellido}`,
        `Nivel de educacion: ${datos.nivelEducacion}`,
        `Fecha de nacimiento: ${this.formatDate(datos.fechaNacimiento)}`
      ].join('\n'),
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  private animarCampos(): void {
    const elements = [this.nombreField?.nativeElement, this.apellidoField?.nativeElement].filter(
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

  private formatDate(value: Date | string | null | undefined): string {
    if (!value) {
      return '';
    }

    const date = value instanceof Date ? value : new Date(value);
    return new Intl.DateTimeFormat('es-CL').format(date);
  }
}
