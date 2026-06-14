import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HomePage } from './home.page';
import { WorkoutService } from '../services/workout.service';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideRouter([])]
    }).compileComponents();

    const workoutService = TestBed.inject(WorkoutService);
    workoutService.login({ name: 'Test', goal: 3 });

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
