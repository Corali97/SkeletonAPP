import { Injectable } from '@angular/core';

export interface HomeData {
  nombre: string;
  apellido: string;
  nivelEducacion: string;
  fechaNacimiento: string;
}

const USER_KEY = 'skeletonapp-user';
const HOME_DATA_KEY = 'skeletonapp-home-data';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {
  get user(): string {
    return localStorage.getItem(USER_KEY) ?? '';
  }

  setUser(user: string): void {
    localStorage.setItem(USER_KEY, user);
  }

  clearUser(): void {
    localStorage.removeItem(USER_KEY);
  }

  getHomeData(): HomeData {
    const fallback: HomeData = {
      nombre: '',
      apellido: '',
      nivelEducacion: '',
      fechaNacimiento: ''
    };

    try {
      return {
        ...fallback,
        ...(JSON.parse(localStorage.getItem(HOME_DATA_KEY) ?? '{}') as Partial<HomeData>)
      };
    } catch {
      return fallback;
    }
  }

  saveHomeData(data: HomeData): void {
    localStorage.setItem(HOME_DATA_KEY, JSON.stringify(data));
  }
}
