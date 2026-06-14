import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import {
  IonButton,
  IonCheckbox,
  IonIcon,
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { saveOutline } from 'ionicons/icons';

import { AppDataService } from '../../../services/app-data.service';

@Component({
  selector: 'app-certificaciones',
  templateUrl: './certificaciones.component.html',
  styleUrls: ['./certificaciones.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    IonButton,
    IonCheckbox,
    IonIcon,
    IonItem,
    IonList,
    IonSelect,
    IonSelectOption
  ]
})
export class CertificacionesComponent {
  readonly certificados = [
    'Certificado de nacimiento',
    'Certificado de estudios',
    'Certificado de antecedentes',
    'Certificado de residencia',
    'Certificado de matrimonio',
    'Certificado medico',
    'Certificado de alumno regular',
    'Otro certificado'
  ];

  readonly form = this.formBuilder.group({
    nombreCertificado: [this.appDataService.getCertification().nombreCertificado, [Validators.required]],
    fechaObtencion: [
      this.appDataService.getCertification().fechaObtencion
        ? new Date(this.appDataService.getCertification().fechaObtencion)
        : null,
      [Validators.required]
    ],
    vence: [this.appDataService.getCertification().vence],
    fechaVencimiento: [
      this.appDataService.getCertification().fechaVencimiento
        ? new Date(this.appDataService.getCertification().fechaVencimiento)
        : null
    ],
    documentoNombre: [this.appDataService.getCertification().documentoNombre]
  });

  constructor(
    private readonly alertController: AlertController,
    private readonly appDataService: AppDataService,
    private readonly formBuilder: FormBuilder
  ) {
    addIcons({ saveOutline });
  }

  async guardar(): Promise<void> {
    const vence = Boolean(this.form.controls.vence.value);
    const fechaVencimiento = this.form.controls.fechaVencimiento.value;

    if (vence && !fechaVencimiento) {
      this.form.controls.fechaVencimiento.setErrors({ required: true });
    } else {
      this.form.controls.fechaVencimiento.setErrors(null);
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const alert = await this.alertController.create({
        header: 'Datos incompletos',
        message: 'Completa el certificado, fecha de obtencion y fecha de vencimiento si corresponde.',
        buttons: ['Aceptar']
      });
      await alert.present();
      return;
    }

    const data = this.form.getRawValue();
    this.appDataService.saveCertification({
      nombreCertificado: data.nombreCertificado ?? '',
      fechaObtencion: data.fechaObtencion instanceof Date ? data.fechaObtencion.toISOString() : '',
      vence: Boolean(data.vence),
      fechaVencimiento: data.vence && data.fechaVencimiento instanceof Date ? data.fechaVencimiento.toISOString() : '',
      documentoNombre: data.documentoNombre ?? ''
    });

    const alert = await this.alertController.create({
      header: 'Certificacion guardada',
      cssClass: 'datos-alert',
      message: [
        `Certificado: ${data.nombreCertificado}`,
        `Fecha obtencion: ${this.formatDate(data.fechaObtencion)}`,
        `Vencimiento: ${data.vence ? this.formatDate(data.fechaVencimiento) : 'No vence'}`,
        `Documento: ${data.documentoNombre || 'No seleccionado'}`
      ].join('\n'),
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  onDocumentSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const fileName = input.files?.[0]?.name ?? '';
    this.form.controls.documentoNombre.setValue(fileName);
  }

  private formatDate(value: Date | string | null | undefined): string {
    if (!value) {
      return '';
    }

    const date = value instanceof Date ? value : new Date(value);
    return new Intl.DateTimeFormat('es-CL').format(date);
  }
}
