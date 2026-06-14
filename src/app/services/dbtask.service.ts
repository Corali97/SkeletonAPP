import { Injectable } from '@angular/core';

export interface SessionData {
  user_name: string;
  password: number;
  active: number;
}

const SESSION_TABLE_KEY = 'skeletonapp-sesion-data';
const STORAGE_SESSION_KEY = 'skeletonapp-storage-session';

@Injectable({
  providedIn: 'root'
})
export class DBTaskService {
  private sqliteObject: unknown;

  createTables(): void {
    if (!localStorage.getItem(SESSION_TABLE_KEY)) {
      localStorage.setItem(SESSION_TABLE_KEY, JSON.stringify([]));
    }
  }

  setDatabase(sqliteObject: unknown): void {
    this.sqliteObject = sqliteObject;
  }

  getDatabase(): unknown {
    return this.sqliteObject;
  }

  hasActiveSession(): boolean {
    return this.getSessions().some((session) => session.active === 1);
  }

  getActiveSession(): SessionData | null {
    return this.getSessions().find((session) => session.active === 1) ?? null;
  }

  validateUser(userName: string, password: string): boolean {
    return this.getSessions().some(
      (session) => session.user_name === userName && session.password === Number(password)
    );
  }

  registerSession(userName: string, password: string): void {
    const sessions = this.getSessions().filter((session) => session.user_name !== userName);
    sessions.push({
      user_name: userName,
      password: Number(password),
      active: 1
    });
    this.saveSessions(this.deactivateOthers(sessions, userName));
    this.saveStorageSession(userName);
  }

  updateSessionActive(userName: string, active: number): void {
    const sessions = this.getSessions().map((session) => ({
      ...session,
      active: session.user_name === userName ? active : 0
    }));
    this.saveSessions(sessions);

    if (active === 1) {
      this.saveStorageSession(userName);
    } else {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    }
  }

  login(userName: string, password: string): boolean {
    if (!this.validateUser(userName, password)) {
      return false;
    }

    this.updateSessionActive(userName, 1);
    return true;
  }

  logout(): void {
    const sessions = this.getSessions().map((session) => ({ ...session, active: 0 }));
    this.saveSessions(sessions);
    localStorage.removeItem(STORAGE_SESSION_KEY);
  }

  getStoredSession(): string {
    return localStorage.getItem(STORAGE_SESSION_KEY) ?? '';
  }

  private saveStorageSession(userName: string): void {
    localStorage.setItem(STORAGE_SESSION_KEY, userName);
  }

  private deactivateOthers(sessions: SessionData[], activeUserName: string): SessionData[] {
    return sessions.map((session) => ({
      ...session,
      active: session.user_name === activeUserName ? 1 : 0
    }));
  }

  private getSessions(): SessionData[] {
    this.createTables();

    try {
      return JSON.parse(localStorage.getItem(SESSION_TABLE_KEY) ?? '[]') as SessionData[];
    } catch {
      return [];
    }
  }

  private saveSessions(sessions: SessionData[]): void {
    localStorage.setItem(SESSION_TABLE_KEY, JSON.stringify(sessions));
  }
}
