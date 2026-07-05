import { TestBed } from '@angular/core/testing';

import { AppDataService, HomeData } from './app-data.service';

describe('AppDataService', () => {
  let service: AppDataService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppDataService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should store and read the active user', () => {
    service.setUser('coral01');

    expect(service.user).toBe('coral01');
  });

  it('should persist personal data entered in Home', () => {
    const data: HomeData = {
      nombre: 'Corali',
      apellido: 'Rodriguez',
      nivelEducacion: 'Universitaria',
      fechaNacimiento: '1997-04-28'
    };

    service.saveHomeData(data);

    expect(service.getHomeData()).toEqual(data);
  });

  it('should save posts obtained from the API section', () => {
    const posts = [
      {
        id: 1,
        title: 'Consulta API',
        body: 'Respuesta guardada para revision',
        userId: 1
      }
    ];

    service.saveApiPosts(posts);

    expect(service.getApiPosts()).toEqual(posts);
  });

  it('should toggle daily exercise progress', () => {
    const dateKey = '2026-07-05';

    service.toggleCompleted('1', dateKey);
    expect(service.getCompletedIds(dateKey)).toEqual(['1']);

    service.toggleCompleted('1', dateKey);
    expect(service.getCompletedIds(dateKey)).toEqual([]);
  });
});
