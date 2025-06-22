import { Component } from '@angular/core';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.scss'],
  standalone: false,
})
export class MisDatosComponent {
  nombre = 'Usuario Ejemplo';
  correo = 'usuario@ejemplo.com';
  telefono = '+56 9 1234 5678';
}
