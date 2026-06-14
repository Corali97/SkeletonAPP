import { Injectable } from '@angular/core';

export type ExerciseCategory = 'gluteos' | 'abdomen' | 'piernas' | 'brazos';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  minutes: number;
}

export interface AgendaFitUser {
  name: string;
  goal: number;
}

export interface AgendaFitProfile {
  firstName: string;
  lastName: string;
  educationLevel: string;
  birthDate: string;
}

interface AgendaFitState {
  user: AgendaFitUser | null;
  profile: AgendaFitProfile;
  exercises: Exercise[];
  completed: Record<string, string[]>;
}

const STORAGE_KEY = 'agendafit-state';

const DEFAULT_EXERCISES: Exercise[] = [
  { id: '1', name: 'Puente de gluteos', category: 'gluteos', minutes: 6 },
  { id: '2', name: 'Plancha abdominal', category: 'abdomen', minutes: 5 },
  { id: '3', name: 'Sentadillas', category: 'piernas', minutes: 7 },
  { id: '4', name: 'Flexiones', category: 'brazos', minutes: 6 },
];

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  readonly categories: ExerciseCategory[] = ['gluteos', 'abdomen', 'piernas', 'brazos'];

  readonly categoryLabels: Record<ExerciseCategory, string> = {
    gluteos: 'Gluteos',
    abdomen: 'Abdomen',
    piernas: 'Piernas',
    brazos: 'Brazos',
  };

  private state: AgendaFitState = this.loadState();

  get user(): AgendaFitUser | null {
    return this.state.user;
  }

  get exercises(): Exercise[] {
    return this.state.exercises;
  }

  get profile(): AgendaFitProfile {
    return this.state.profile;
  }

  login(user: AgendaFitUser): void {
    this.state.user = user;
    this.saveState();
  }

  logout(): void {
    this.state.user = null;
    this.saveState();
  }

  addExercise(name: string, category: ExerciseCategory): void {
    this.state.exercises = [
      ...this.state.exercises,
      {
        id: Date.now().toString(),
        name,
        category,
        minutes: 5,
      },
    ];
    this.saveState();
  }

  saveProfile(profile: AgendaFitProfile): void {
    this.state.profile = profile;
    this.saveState();
  }

  getDailyRoutine(): Exercise[] {
    return this.exercises.slice(0, 4);
  }

  getCompletedIds(dateKey = this.todayKey()): string[] {
    return this.state.completed[dateKey] ?? [];
  }

  toggleCompleted(exerciseId: string, dateKey = this.todayKey()): void {
    const current = new Set(this.getCompletedIds(dateKey));

    if (current.has(exerciseId)) {
      current.delete(exerciseId);
    } else {
      current.add(exerciseId);
    }

    this.state.completed[dateKey] = Array.from(current);
    this.saveState();
  }

  resetWeek(): void {
    this.state.completed = {};
    this.saveState();
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

  private todayKey(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private loadState(): AgendaFitState {
    const fallback: AgendaFitState = {
      user: null,
      profile: {
        firstName: '',
        lastName: '',
        educationLevel: '',
        birthDate: '',
      },
      exercises: DEFAULT_EXERCISES,
      completed: {},
    };

    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return fallback;
      }

      const parsed = JSON.parse(saved) as Partial<AgendaFitState>;
      return {
        user: parsed.user ?? fallback.user,
        profile: {
          ...fallback.profile,
          ...(parsed.profile ?? {}),
        },
        exercises: parsed.exercises ?? fallback.exercises,
        completed: parsed.completed ?? fallback.completed,
      };
    } catch {
      return fallback;
    }
  }

  private saveState(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }
}
