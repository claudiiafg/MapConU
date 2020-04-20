import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { IndoorTimeOfArrivalComponent } from './indoor-time-of-arrival.component';

export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'src/assets/i18n', '.json');
}

describe('IndoorTimeOfArrivalComponent', () => {
  let component: IndoorTimeOfArrivalComponent;
  let fixture: ComponentFixture<IndoorTimeOfArrivalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IndoorTimeOfArrivalComponent],
      imports: [IonicModule.forRoot(), HttpClientModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: LanguageLoader,
          deps: [HttpClient]
        }
      })]
    }).compileComponents();

    fixture = TestBed.createComponent(IndoorTimeOfArrivalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("it should subscribeToToaParams on init", () => {
    spyOn(component, "subscribeToToaParams");
    component.ngOnInit();

    expect(component.subscribeToToaParams).toHaveBeenCalled();
  });
  it("it should subscribeToToaParams", () => {
    spyOn(component["dataSharing"].toaParams, "subscribe");
    component.subscribeToToaParams();

    expect(component["dataSharing"].toaParams.subscribe).toHaveBeenCalledWith(jasmine.any(Function));
  });
});
