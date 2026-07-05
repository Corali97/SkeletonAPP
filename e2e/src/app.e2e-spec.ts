import { browser, by, element, ExpectedConditions as EC } from 'protractor';

import { AppPage } from './app.po';

describe('SkeletonAPP E2E', () => {
  let page: AppPage;

  beforeEach(async () => {
    page = new AppPage();
    await browser.waitForAngularEnabled(false);
    await page.navigateTo('login');
    await page.clearStorage();
    await page.navigateTo('login');
  });

  it('should show the Login page as the first screen', async () => {
    expect(await page.getLoginTitle()).toContain('Login');
  });

  it('should register a user and open Home with the received user name', async () => {
    await page.registerUser('e2e01', '1234');

    expect(await page.getHomeTitle()).toContain('e2e01');
  });

  it('should open the API Connection section from Home', async () => {
    await page.registerUser('api01', '1234');
    await page.openHomeCard('API Connection');

    await browser.wait(EC.urlContains('/api-connection'), 5000);
    expect(await element(by.css('app-api-connection ion-title')).getText()).toContain('API');
  });

  it('should show the 404 page for an invalid route', async () => {
    await browser.get('ruta-invalida-s7');
    await browser.wait(EC.presenceOf(element(by.css('app-not-found'))), 5000);

    expect(await page.getNotFoundTitle()).toContain('404');
  });
});
