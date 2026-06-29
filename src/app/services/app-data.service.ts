import { Injectable } from '@angular/core';

export interface HomeData {
  nombre: string;
  apellido: string;
  nivelEducacion: string;
  fechaNacimiento: string;
}

export interface WorkExperience {
  empresa: string;
  anioInicio: string;
  trabajaActualmente: boolean;
  anioTermino: string;
  cargo: string;
}

export interface Certification {
  nombreCertificado: string;
  fechaObtencion: string;
  vence: boolean;
  fechaVencimiento: string;
  documentoNombre: string;
}

export interface ApiPost {
  id?: number;
  title: string;
  body: string;
  userId: number;
}

export type ExerciseCategory = 'gluteos' | 'abdomen' | 'piernas' | 'brazos';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  minutes: number;
}

const USER_KEY = 'skeletonapp-user';
const HOME_DATA_KEY = 'skeletonapp-home-data';
const WORK_EXPERIENCE_KEY = 'skeletonapp-work-experience';
const CERTIFICATION_KEY = 'skeletonapp-certification';
const API_POSTS_KEY = 'skeletonapp-api-posts';
const EXERCISES_KEY = 'skeletonapp-exercises';
const COMPLETED_KEY = 'skeletonapp-completed';

const DEFAULT_EXERCISES: Exercise[] = [
  { id: '1', name: 'Puente de gluteos', category: 'gluteos', minutes: 6 },
  { id: '2', name: 'Plancha abdominal', category: 'abdomen', minutes: 5 },
  { id: '3', name: 'Sentadillas', category: 'piernas', minutes: 7 },
  { id: '4', name: 'Flexiones', category: 'brazos', minutes: 6 }
];

@Injectable({
  providedIn: 'root'
})
export class AppDataService {
  readonly categories: ExerciseCategory[] = ['gluteos', 'abdomen', 'piernas', 'brazos'];

  readonly categoryLabels: Record<ExerciseCategory, string> = {
    gluteos: 'Gluteos',
    abdomen: 'Abdomen',
    piernas: 'Piernas',
    brazos: 'Brazos'
  };

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

  getWorkExperience(): WorkExperience {
    const fallback: WorkExperience = {
      empresa: '',
      anioInicio: '',
      trabajaActualmente: false,
      anioTermino: '',
      cargo: ''
    };

    try {
      return {
        ...fallback,
        ...(JSON.parse(localStorage.getItem(WORK_EXPERIENCE_KEY) ?? '{}') as Partial<WorkExperience>)
      };
    } catch {
      return fallback;
    }
  }

  saveWorkExperience(data: WorkExperience): void {
    localStorage.setItem(WORK_EXPERIENCE_KEY, JSON.stringify(data));
  }

  getCertification(): Certification {
    const fallback: Certification = {
      nombreCertificado: '',
      fechaObtencion: '',
      vence: false,
      fechaVencimiento: '',
      documentoNombre: ''
    };

    try {
      return {
        ...fallback,
        ...(JSON.parse(localStorage.getItem(CERTIFICATION_KEY) ?? '{}') as Partial<Certification>)
      };
    } catch {
      return fallback;
    }
  }

  saveCertification(data: Certification): void {
    localStorage.setItem(CERTIFICATION_KEY, JSON.stringify(data));
  }

  getApiPosts(): ApiPost[] {
    try {
      return JSON.parse(localStorage.getItem(API_POSTS_KEY) ?? '[]') as ApiPost[];
    } catch {
      return [];
    }
  }

  saveApiPosts(posts: ApiPost[]): void {
    localStorage.setItem(API_POSTS_KEY, JSON.stringify(posts));
  }

  getExercises(): Exercise[] {
    try {
      return JSON.parse(localStorage.getItem(EXERCISES_KEY) ?? 'null') ?? DEFAULT_EXERCISES;
    } catch {
      return DEFAULT_EXERCISES;
    }
  }

  addExercise(name: string, category: ExerciseCategory): void {
    const exercises = [
      ...this.getExercises(),
      {
        id: Date.now().toString(),
        name,
        category,
        minutes: 5
      }
    ];
    localStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
  }

  getDailyRoutine(): Exercise[] {
    return this.getExercises().slice(0, 4);
  }

  getCompletedIds(dateKey = this.todayKey()): string[] {
    const completed = this.getCompleted();
    return completed[dateKey] ?? [];
  }

  toggleCompleted(exerciseId: string, dateKey = this.todayKey()): void {
    const completed = this.getCompleted();
    const current = new Set(completed[dateKey] ?? []);

    if (current.has(exerciseId)) {
      current.delete(exerciseId);
    } else {
      current.add(exerciseId);
    }

    completed[dateKey] = Array.from(current);
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(completed));
  }

  resetWeek(): void {
    localStorage.setItem(COMPLETED_KEY, JSON.stringify({}));
  }

  currentWeekKeys(): string[] {
    const now = new Date();
    const monday = new Date(now);
    const day = now.getDay() || 7;
    monday.setDate(now.getDate() - day + 1);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return date.toISOString().slice(0, 10);
    });
  }

  private getCompleted(): Record<string, string[]> {
    try {
      return JSON.parse(localStorage.getItem(COMPLETED_KEY) ?? '{}') as Record<string, string[]>;
    } catch {
      return {};
    }
  }

  private todayKey(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
