const testUser = 'cy01';
const testPassword = '1234';

function clearAppStorage() {
  cy.window().then((window) => {
    window.localStorage.clear();
  });
}

function fillIonInput(formControlName, value) {
  cy.get(`ion-input[formcontrolname="${formControlName}"]`)
    .should('exist')
    .then(($input) => $input[0].getInputElement())
    .then((input) => {
      cy.wrap(input).clear().type(value);
    });
}

function registerAndOpenHome() {
  cy.visit('/login');
  clearAppStorage();
  cy.visit('/login');

  fillIonInput('usuario', testUser);
  fillIonInput('password', testPassword);
  cy.contains('ion-button', 'Registrar').click();

  cy.url().should('include', '/home');
  cy.contains('Hola').should('be.visible');
  cy.contains(testUser).should('be.visible');
}

describe('SkeletonAPP - pruebas E2E con Cypress', () => {
  it('protege Home cuando no existe una sesion activa', () => {
    cy.visit('/login');
    clearAppStorage();

    cy.visit('/home');

    cy.url().should('include', '/login');
    cy.contains('Login').should('be.visible');
  });

  it('permite registrar usuario y pasar el usuario recibido al Home', () => {
    registerAndOpenHome();
  });

  it('permite navegar desde Home hacia API Connection', () => {
    registerAndOpenHome();

    cy.contains('ion-card', 'API Connection').click();

    cy.url().should('include', '/api-connection');
    cy.contains('Consumo API REST').should('be.visible');
    cy.contains('Leer API').should('be.visible');
  });

  it('muestra Error 404 cuando se ingresa una ruta invalida', () => {
    cy.visit('/ruta-invalida-cypress');

    cy.contains('Error 404').should('be.visible');
    cy.contains('404').should('be.visible');
  });
});
