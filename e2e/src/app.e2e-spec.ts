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
  it('Current Campus should toggle when selected at top of the UI', () => {
    browser.get('/');
    //set location to sgw
    element(by.xpath("/html/body/app-root/ion-app/header/app-outdoor-navigation-toolbar/ion-header/ion-toolbar/ion-item/ion-select")).click();
    browser.driver.sleep(500);
    element(by.xpath("/html/body/app-root/ion-app/ion-popover/div/div[2]/ion-select-popover/ion-list/ion-radio-group/ion-item[1]")).click();

    //check location is set to SGW
    expect(element(by.id("campus-change")).getText()).toContain("SGW Campus");
    expect(element(by.css('ng-reflect-longitude="-73.578041"'))).toBeDefined();
    expect(element(by.css('ng-reflect-latitude="45.495729"'))).toBeDefined();

    //set location to Loyola
    element(by.xpath("/html/body/app-root/ion-app/header/app-outdoor-navigation-toolbar/ion-header/ion-toolbar/ion-item/ion-select")).click();
    browser.driver.sleep(500);
    element(by.xpath("/html/body/app-root/ion-app/ion-popover/div/div[2]/ion-select-popover/ion-list/ion-radio-group/ion-item[2]")).click();

    //check locations is set to loyla
    expect(element(by.id("campus-change")).getText()).toContain("Loyola Campus");
    expect(element(by.css('ng-reflect-longitude="-73.640452"'))).toBeDefined();
    expect(element(by.css('ng-reflect-latitude="45.45824"'))).toBeDefined();

  });

});

