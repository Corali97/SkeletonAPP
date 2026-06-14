import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonText
} from '@ionic/angular/standalone';
import { AnimationController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, lockClosedOutline, personAddOutline, personCircleOutline } from 'ionicons/icons';

import { AppDataService } from '../services/app-data.service';
import { DBTaskService } from '../services/dbtask.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonContent,
    IonIcon,
    IonInput,
    IonItem,
    IonList,
    IonText
  ]
})
export class LoginPage implements AfterViewInit {
  @ViewChild('brandMark', { read: ElementRef }) private brandMark?: ElementRef<HTMLElement>;

  readonly form = this.formBuilder.nonNullable.group({
    usuario: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(8),
        Validators.pattern(/^[a-zA-Z0-9]+$/)
      ]
    ],
    password: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]]
  });

  constructor(
    private readonly animationController: AnimationController,
    private readonly appDataService: AppDataService,
    private readonly dbTaskService: DBTaskService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {
    addIcons({ arrowForwardOutline, lockClosedOutline, personAddOutline, personCircleOutline });
    this.dbTaskService.createTables();

    const activeSession = this.dbTaskService.getActiveSession();
    if (activeSession) {
      this.openHome(activeSession.user_name);
    }
  }

  ngAfterViewInit(): void {
    if (!this.brandMark?.nativeElement) {
      return;
    }

    this.animationController
      .create()
      .addElement(this.brandMark.nativeElement)
      .duration(1000)
      .iterations(1)
      .fromTo('transform', 'scale(0.86)', 'scale(1)')
      .fromTo('opacity', '0.35', '1')
      .play();
  }

  ingresar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const usuario = this.form.controls.usuario.value.trim();
    const password = this.form.controls.password.value;

    if (!this.dbTaskService.login(usuario, password)) {
      this.form.controls.password.setErrors({ invalidLogin: true });
      return;
    }

    this.openHome(usuario);
  }

  registrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const usuario = this.form.controls.usuario.value.trim();
    const password = this.form.controls.password.value;
    this.dbTaskService.registerSession(usuario, password);
    this.openHome(usuario);
  }

  private openHome(usuario: string): void {
    this.appDataService.setUser(usuario);

    const extras: NavigationExtras = {
      queryParams: { usuario },
      state: { usuario },
      replaceUrl: true
    };

    void this.router.navigate(['/home'], extras);
  }
}
