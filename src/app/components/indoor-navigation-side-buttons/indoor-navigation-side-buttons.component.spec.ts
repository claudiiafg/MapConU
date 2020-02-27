import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {IonicModule} from "@ionic/angular";

import {IndoorNavigationSideButtonsComponent} from "./indoor-navigation-side-buttons.component";

describe("IndoorNavigationSideButtonsComponent", () => {
  let component: IndoorNavigationSideButtonsComponent;
  let fixture: ComponentFixture<IndoorNavigationSideButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IndoorNavigationSideButtonsComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IndoorNavigationSideButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
