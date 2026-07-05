import { browser, by, element, ExpectedConditions as EC } from 'protractor';

export class AppPage {
  async navigateTo(path = 'login'): Promise<void> {
    await browser.get(path);
    await browser.wait(EC.presenceOf(element(by.css('ion-content'))), 5000);
  }

  async clearStorage(): Promise<void> {
    await browser.executeScript('window.localStorage.clear();');
  }

  async typeIonInput(formControlName: string, value: string): Promise<void> {
    const ionInput = element(by.css(`ion-input[formcontrolname="${formControlName}"]`));
    await browser.wait(EC.presenceOf(ionInput), 5000);
    await browser.executeAsyncScript(
      `
        const ionInput = arguments[0];
        const value = arguments[1];
        const done = arguments[2];

        ionInput.getInputElement().then((input) => {
          input.value = value;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          ionInput.dispatchEvent(new CustomEvent('ionInput', { detail: { value }, bubbles: true }));
          ionInput.dispatchEvent(new CustomEvent('ionChange', { detail: { value }, bubbles: true }));
          done();
        });
      `,
      ionInput.getWebElement(),
      value
    );
  }

  async clickIonButton(text: string): Promise<void> {
    const button = element(by.cssContainingText('ion-button', text));
    await browser.wait(EC.elementToBeClickable(button), 5000);
    await button.click();
  }

  async registerUser(userName: string, password: string): Promise<void> {
    await this.typeIonInput('usuario', userName);
    await this.typeIonInput('password', password);
    await this.clickIonButton('Registrar');
    await browser.wait(EC.urlContains('/home'), 5000);
  }

  async openHomeCard(title: string): Promise<void> {
    const card = element(by.cssContainingText('ion-card', title));
    await browser.wait(EC.elementToBeClickable(card), 5000);
    await card.click();
  }

  getLoginTitle() {
    return element(by.css('app-login h1')).getText();
  }

  getHomeTitle() {
    return element(by.css('app-home ion-title')).getText();
  }

  getNotFoundTitle() {
    return element(by.css('app-not-found h1')).getText();
  }
}
