import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { AlertController, AnimationController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  barbellOutline,
  eyeOutline,
  logOutOutline,
  refreshOutline,
  schoolOutline
} from 'ionicons/icons';

import { AppDataService } from '../services/app-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
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
    IonButtons,
    IonCard,
    IonCardContent,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar
  ]
})
export class HomePage implements AfterViewInit {
  @ViewChild('homeTitle', { read: ElementRef }) private homeTitle?: ElementRef<HTMLElement>;
  @ViewChild('nombreField', { read: ElementRef }) private nombreField?: ElementRef<HTMLElement>;
  @ViewChild('apellidoField', { read: ElementRef }) private apellidoField?: ElementRef<HTMLElement>;

  usuario = 'Usuario';
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
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    addIcons({ barbellOutline, eyeOutline, logOutOutline, refreshOutline, schoolOutline });

    this.usuario = this.router.getCurrentNavigation()?.extras.state?.['usuario']
      ?? history.state?.usuario
      ?? this.appDataService.user
      ?? this.usuario;

    this.route.queryParamMap.subscribe((params) => {
      this.usuario = params.get('usuario') ?? this.usuario;
    });
  }

  ngAfterViewInit(): void {
    if (!this.homeTitle?.nativeElement) {
      return;
    }

    this.animationController
      .create()
      .addElement(this.homeTitle.nativeElement)
      .duration(1000)
      .iterations(1)
      .fromTo('transform', 'translateX(-18px)', 'translateX(0)')
      .fromTo('opacity', '0.35', '1')
      .play();
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
      message: `Nombre: ${datos.nombre}
Apellido: ${datos.apellido}
Nivel de educacion: ${datos.nivelEducacion}
Fecha de nacimiento: ${this.formatDate(datos.fechaNacimiento)}`,
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  logout(): void {
    this.appDataService.clearUser();
    void this.router.navigateByUrl('/login', { replaceUrl: true });
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
