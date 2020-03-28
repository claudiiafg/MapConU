import { AppPage } from './app.po';
import { browser, by, element, $ } from 'protractor';
import { protractor } from 'protractor/built/ptor';
describe('new App', () => {
  let page: AppPage;

  beforeEach(() => {
    browser.get("/");
    browser.driver.sleep(200);

    browser
      .actions()
      .mouseMove(element(by.css("button.alert-button")))
      .click()
      .perform();
    browser.driver.sleep(200);

    browser
      .actions()
      .mouseMove(element(by.css("button.alert-button")))
      .click()
      .perform();

    browser.driver.sleep(200);

  });

  it('Has MapConU as the Title ', () => {
    browser.get('/');
    expect(browser.getTitle()).toContain('MapConU');
  });
it("Should toggle Campuses when selected at top of the UI", () => {
    // commenting this as it refreshes the page
    // can also sleep and wait until page fully loaded

    //check location is set to SGW
    expect(element(by.id("campus-change")).getText()).toContain("SGW Campus");
    expect(element(by.css('ng-reflect-longitude="-73.578041"'))).toBeDefined();
    expect(element(by.css('ng-reflect-latitude="45.495729"'))).toBeDefined();

    browser
      .actions()
      .mouseMove(element(by.id("campus-select")))
      .click()
      .perform();

    browser.driver.sleep(200);

    //set location to Loyola
    browser
      .actions()
      .mouseMove(element(by.id("ion-rb-1-lbl")))
      .click()
      .perform();
    browser.driver.sleep(200);

    //check locations is set to loyla
    expect(element(by.id("campus-change")).getText()).toContain(
      "Loyola Campus"
    );
    expect(element(by.css('ng-reflect-longitude="-73.640452"'))).toBeDefined();
    expect(element(by.css('ng-reflect-latitude="45.45824"'))).toBeDefined();
  });
it("Should open up the bus schedule", () => {
  browser
    .actions()
    .mouseMove(element(by.id("bus-button")))
    .click()
    .perform();
  expect(element(by.css('src="./assets/schedule/schedule.png"'))).toBeDefined();
  });
it("Should look up Hall building in the searchbar", () => {
  //element(by.id("outdoor-search")).click();
  browser.driver.sleep(200);
  element(by.id("outdoor-search")).sendKeys("hall"+protractor.Key.ENTER);
  });
});
