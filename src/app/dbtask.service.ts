import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({ providedIn: 'root' })
export class DBTaskService {
  private dbInstance!: SQLiteObject;

  constructor(private sqlite: SQLite) {}

  async initDB() {
    if (this.dbInstance) return;
    this.dbInstance = await this.sqlite.create({
      name: 'usuarios.db',
      location: 'default'
    });
    await this.dbInstance.executeSql(
      `CREATE TABLE IF NOT EXISTS sesion_data (
        user_name TEXT PRIMARY KEY NOT NULL,
        password INTEGER NOT NULL,
        active INTEGER NOT NULL
      )`, []);
  }

  async registerUser(username: string, password: number) {
    try {
      await this.dbInstance.executeSql('INSERT INTO sesion_data (user_name, password, active) VALUES (?, ?, 1)', [username, password]);
      return true;
    } catch (e) {
      return false;
    }
  }

  async validateUser(username: string, password: number): Promise<boolean> {
    const res = await this.dbInstance.executeSql('SELECT * FROM sesion_data WHERE user_name = ? AND password = ?', [username, password]);
    return res.rows.length > 0;
  }

  async hasActiveSession(): Promise<boolean> {
    const res = await this.dbInstance.executeSql('SELECT * FROM sesion_data WHERE active = 1', []);
    return res.rows.length > 0;
  }

  async setSessionActive(username: string) {
    await this.dbInstance.executeSql('UPDATE sesion_data SET active = 0', []);
    await this.dbInstance.executeSql('UPDATE sesion_data SET active = 1 WHERE user_name = ?', [username]);
  }

  async logoutSession(username: string) {
    await this.dbInstance.executeSql('UPDATE sesion_data SET active = 0 WHERE user_name = ?', [username]);
  }
}
