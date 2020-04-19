import { AppPage } from './app.po';
import { browser, by, element, $, By } from 'protractor';
import { protractor } from 'protractor/built/ptor';
var fs = require('fs')
// abstract writing screen shot to a file
function writeScreenShot(data, filename) {
  var stream = fs.createWriteStream('./e2e/screenshots/'+filename);
  stream.write(new Buffer(data, 'base64'));
  stream.end();
}
// within a test:

describe('MapConU', () => {
  let page: AppPage;
  beforeEach(() => {
    browser.waitForAngularEnabled(false);
    browser.get("/");
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

  });

  it('Has MapConU as the Title ', () => {
    expect(browser.getTitle()).toContain('MapConU');
    browser.takeScreenshot().then(function (png) {
    writeScreenShot(png, 'TitleTest.png');
});
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
    browser.takeScreenshot().then(function (png) {writeScreenShot(png, 'ToggleCampusTest.png');});
  });
it("Should open up the bus schedule", () => {
  browser
    .actions()
    .mouseMove(element(by.id("bus-button")))
    .click()
    .perform();
  expect(element(by.css('src="./assets/schedule/schedule.png"'))).toBeDefined();
  browser.takeScreenshot().then(function (png) {writeScreenShot(png, 'BusScheduleTest.png');});
  });
it("Should look up Hall building in the searchbar", () => {
  //browser.actions().mouseMove(element(by.id("outdoor-search"))).click().perform();
  browser.actions().sendKeys("hall").perform();
  expect(element(by.css('value="Henry F.Hall Building, Boulevard de Maisonneuve Ouest, Montreal, QC, Canada"'))).toBeDefined();
  browser.takeScreenshot().then(function (png) {writeScreenShot(png, 'OutdoorSearchTest.png');});
  });
it("Should bring up a menu to input current address and destination address", () => {
  browser
    .actions()
    .mouseMove(element(by.id("navigation-button")))
    .click()
    .perform();
  expect(element(by.id("fromAddress"))).toBeDefined();
  browser.takeScreenshot().then(function (png) {writeScreenShot(png, 'toandfromTest.png');});
  });
it("Should direct to settings page", () => {
  browser.actions().mouseMove(element(by.id("button-settings"))).click().perform();
  browser.takeScreenshot().then(function (png) {writeScreenShot(png, 'SettingsPage.png');});
  expect(element(by.id("settings-title")).getText()).toContain("Settings + More");
  });
it("Should change the language of the settings page", () => {
  browser.actions().mouseMove(element(by.id("button-settings"))).click().perform();

  browser
  .actions()
  .mouseMove(element(by.id("language-selection")))
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

  browser.takeScreenshot().then(function (png) {writeScreenShot(png, 'SettingsPageinFrench.png');});
  expect(element(by.id("settings-title")).getText()).toContain("Paramètres + Plus");
  });
it("Should change the language of the outdoor page", () => {
  browser.actions().mouseMove(element(by.id("button-settings"))).click().perform();

  browser
  .actions()
  .mouseMove(element(by.id("language-selection")))
  .click()
  .perform();

  browser.driver.sleep(200);

  browser
    .actions()
    .mouseMove(element(by.id("ion-rb-1-lbl")))
    .click()
    .perform();
  browser.driver.sleep(200);


  browser
  .actions()
  .mouseMove(element(by.id("button-back")))
  .click()
  .perform();

  browser.takeScreenshot().then(function (png) {writeScreenShot(png, 'OutdoorPageinFrench.png');});
  expect(element(by.id("campus-change")).getText()).toContain("Campus SGW");

  });
it("Should load the indoor hall page", () => {
  browser.get("/indoor/hall");
  browser.takeScreenshot().then(function (png) {writeScreenShot(png, 'IndoorHallPage.png');});
  expect(element(by.id("indoor-title"))).toBeDefined();
  });
it("Should give a path from h811 to h819", () => {
  browser.get("/indoor/hall");
  browser
  .actions()
  .mouseMove(element(by.id("button-nav")))
  .click()
  .perform();
  //load start popover
  browser.driver.sleep(1000);
  browser
  .actions()
  .mouseMove(element(by.id("indoor-poi-start")))
  .click()
  .perform();
  browser.driver.sleep(1000);
  browser
  .actions()
  .mouseMove(element(by.id("alert-input-2-0")))
  .click()
  .perform();
  browser
  .actions()
  .mouseMove(element(by.xpath("/html/body/app-root/ion-app/ion-alert/div/div[4]/button[2]")))
  .click()
  .perform();
  //load destination popover
  browser.driver.sleep(1000);
  browser
  .actions()
  .mouseMove(element(by.id("indoor-poi-end")))
  .click()
  .perform();
  browser.driver.sleep(1000);
  browser
  .actions()
  .mouseMove(element(by.id("alert-input-3-4")))
  .click()
  .perform();
  browser
  .actions()
  .mouseMove(element(by.xpath("/html/body/app-root/ion-app/ion-alert/div/div[4]/button[2]")))
  .click()
  .perform();
  browser.driver.sleep(1000);
  browser
  .actions()
  .mouseMove(element(by.id("goButton")))
  .click()
  .perform();
  browser.driver.sleep(1000);  



  browser.takeScreenshot().then(function (png) {writeScreenShot(png, 'IndoorHallPageWithPath.png');});
  expect(element(by.id("line1")).getCssValue('stroke')).toBe('rgb(0, 0, 255)');
  expect(element(by.id("line3")).getCssValue('stroke')).toBe('rgb(0, 0, 255)');
  expect(element(by.id("line6")).getCssValue('stroke')).toBe('rgb(0, 0, 255)');
  expect(element(by.id("line8")).getCssValue('stroke')).toBe('rgb(0, 0, 255)');
  expect(element(by.id("line13")).getCssValue('stroke')).toBe('rgb(0, 0, 255)');
  });
});
