import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DBTaskService } from '../services/dbtask.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  username: string = '';
  password: string = '';
  isRegistering: boolean = false;

  constructor(private dbService: DBTaskService, private router: Router, private storage: Storage) {}

  async ionViewWillEnter() {
    await this.dbService.initDB();
    const active = await this.dbService.hasActiveSession();
    if (active) {
      this.router.navigate(['/home']);
    }
  }

  async login() {
    const valid = await this.dbService.validateUser(this.username, +this.password);
    if (valid) {
      await this.dbService.setSessionActive(this.username);
      await this.storage.set('session_user', this.username);
      this.router.navigate(['/home']);
    } else {
      alert('Credenciales inválidas');
    }
  }

  async register() {
    const registered = await this.dbService.registerUser(this.username, +this.password);
    if (registered) {
      await this.dbService.setSessionActive(this.username);
      await this.storage.set('session_user', this.username);
      this.router.navigate(['/home']);
    } else {
      alert('No se pudo registrar. Usuario existente o error.');
    }
  }
}
