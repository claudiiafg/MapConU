import { AppPage } from './app.po';
import { browser, by, element, $, By } from 'protractor';
import { protractor } from 'protractor/built/ptor';
var fs = require('fs')
// abstract writing screen shot to a file
function writeScreenShot(data, filename) {
  var stream = fs.createWriteStream('./screenshots/'+filename);
  stream.write(new Buffer(data, 'base64'));
  stream.end();
}
// within a test:

describe('MapConU', () => {
  let page: AppPage;
  beforeEach(() => {
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
    browser.get('/');
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
  browser.takeScreenshot().then(function (png) {writeScreenShot(png, 'BusScheduleTest');});
  });
it("Should look up Hall building in the searchbar", () => {
  browser.actions().mouseMove(element(by.id("outdoor-search"))).click().perform();
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
});
