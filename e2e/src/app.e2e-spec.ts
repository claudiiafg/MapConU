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
  it('Should toggle Campuses when selected at top of the UI', () => {
    browser.get('/');
    //set location to sgw
    // element(by.xpath("/html/body/app-root/ion-app/ion-router-outlet/app-outdoor-view/ion-header/app-outdoor-navigation-toolbar/ion-header/ion-toolbar/ion-item")).click();
    // browser.driver.sleep(500);
    // element(
    //   by.xpath(
    //     '/html/body/app-root/ion-app/ion-popover/div/div[2]/ion-select-popover/ion-list/ion-radio-group/ion-item[1]'
    //   )
    // ).click();

    //check location is set to SGW
    expect(element(by.id('campus-change')).getText()).toContain('SGW Campus');
    expect(element(by.css('ng-reflect-longitude="-73.578041"'))).toBeDefined();
    expect(element(by.css('ng-reflect-latitude="45.495729"'))).toBeDefined();

    //set location to Loyola
    element(by.xpath("/html/body/app-root/ion-app/ion-router-outlet/app-outdoor-view/ion-header/app-outdoor-navigation-toolbar/ion-header/ion-toolbar/ion-item")).click();
    browser.driver.sleep(500);
    element(
      by.xpath(
        '/html/body/app-root/ion-app/ion-popover/div/div[2]/ion-select-popover/ion-list/ion-radio-group/ion-item[2]'
      )
    ).click();

    //check locations is set to loyla
    expect(element(by.id('campus-change')).getText()).toContain(
      'Loyola Campus'
    );
    expect(element(by.css('ng-reflect-longitude="-73.640452"'))).toBeDefined();
    expect(element(by.css('ng-reflect-latitude="45.45824"'))).toBeDefined();
  });
  it('Shows Current Position Marker', () => {
    browser.get('/');
    //let ele = element(by.xpath("/html/body/app-root/ion-app/app-google-map/div/agm-map/div[1]/div/div/div[1]/div[3]/div/div[3]")).isPresent();
    let ele = element(by.xpath("/html/body/app-root/ion-app/ion-router-outlet/app-outdoor-view/ion-content/app-google-map/div/agm-map/div[1]/div/div/div[1]/div[3]/div/div[3]")).isPresent();
    expect(ele).toBeTruthy();
  });
  //This test will be added in the future
  // it("Shows Directions between point A and point B", () => {
  //   browser.get('/');
  //   element(by.xpath("/html/body/app-root/ion-app/app-outdoor-navigation-side-buttons/ion-fab[2]/ion-fab-button")).click();
  //   browser.driver.sleep(500);
  //   element(by.xpath("/html/body/app-root/ion-app/ion-popover/div/div[2]/app-search-popover/div[1]/input")).click()
  //   element(by.xpath("/html/body/app-root/ion-app/ion-popover/div/div[2]/app-search-popover/div[1]/input")).sendKeys("1400 de maison");
  //   element(by.xpath("/html/body/div[2]/div[1]")).click();
  //   element(by.xpath("/html/body/app-root/ion-app/ion-popover/div/div[2]/app-search-popover/div[2]/input")).click()
  //   element(by.xpath("/html/body/app-root/ion-app/ion-popover/div/div[2]/app-search-popover/div[2]/input")).sendKeys("1450 guy");
  //   element(by.xpath("/html/body/div[2]/div[1]")).click();
  //   expect(true).toBeTruthy;
  // });
});
