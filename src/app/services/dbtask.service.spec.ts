import { TestBed } from '@angular/core/testing';

import { DBTaskService } from './dbtask.service';

describe('DBTaskService', () => {
  let service: DBTaskService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(DBTaskService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the session storage without an active user', () => {
    service.createTables();

    expect(service.hasActiveSession()).toBeFalse();
    expect(service.getStoredSession()).toBe('');
  });

  it('should register a user and keep the session active', () => {
    service.registerSession('alumno1', '1234');

    expect(service.validateUser('alumno1', '1234')).toBeTrue();
    expect(service.hasActiveSession()).toBeTrue();
    expect(service.getStoredSession()).toBe('alumno1');
  });

  it('should activate the session only when login data is valid', () => {
    service.registerSession('alumno2', '4321');
    service.logout();

    expect(service.login('alumno2', '1111')).toBeFalse();
    expect(service.login('alumno2', '4321')).toBeTrue();
    expect(service.getActiveSession()?.user_name).toBe('alumno2');
  });

  it('should close the active session on logout', () => {
    service.registerSession('alumno3', '2222');
    service.logout();

    expect(service.hasActiveSession()).toBeFalse();
    expect(service.getStoredSession()).toBe('');
  });
});
