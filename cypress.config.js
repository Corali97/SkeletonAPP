const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8100',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    includeShadowDom: true,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 8000
  }
});
