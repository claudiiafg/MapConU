import { AppPage } from './app.po';
import { browser, by, element, $ } from 'protractor';
describe('new App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('Has MapConU as the Title ', () => {
    browser.get('/');
    let x = element(by.id('campus-change')).getText();
    expect(browser.getTitle()).toContain('MapConU');
  });
it("Should toggle Campuses when selected at top of the UI", () => {
    // commenting this as it refreshes the page
    // can also sleep and wait until page fully loaded
    browser.get("/");
    browser.driver.sleep(1000);
    //check location is set to SGW
    expect(element(by.id("campus-change")).getText()).toContain("SGW Campus");
    expect(element(by.css('ng-reflect-longitude="-73.578041"'))).toBeDefined();
    expect(element(by.css('ng-reflect-latitude="45.495729"'))).toBeDefined();

    //set location to Loyola
    browser.driver.sleep(1000);

    browser
      .actions()
      .mouseMove(element(by.css("button.alert-button")))
      .click()
      .perform();
    browser.driver.sleep(1000);

    browser
      .actions()
      .mouseMove(element(by.css("button.alert-button")))
      .click()
      .perform();

    browser.driver.sleep(1000);

    browser
      .actions()
      .mouseMove(element(by.id("campus-select")))
      .click()
      .perform();

    browser.driver.sleep(1000);

    //set location to Loyola
    browser
      .actions()
      .mouseMove(element(by.id("ion-rb-1-lbl")))
      .click()
      .perform();
    browser.driver.sleep(1000);

    //check locations is set to loyla
    expect(element(by.id("campus-change")).getText()).toContain(
      "Loyola Campus"
    );
    expect(element(by.css('ng-reflect-longitude="-73.640452"'))).toBeDefined();
    expect(element(by.css('ng-reflect-latitude="45.45824"'))).toBeDefined();
  });
});
