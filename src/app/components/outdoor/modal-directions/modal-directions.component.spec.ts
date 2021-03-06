import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { RouteReuseStrategy, RouterModule } from "@angular/router";
import {
  AngularDelegate,
  IonicModule,
  IonicRouteStrategy,
  ModalController
} from "@ionic/angular";
import { FirestoreSettingsToken } from "@angular/fire/firestore";
import { ModalDirectionsComponent } from "./modal-directions.component";
import { NgPipesModule } from "ngx-pipes";
import { UserServices } from "../../../../services/user.services";
import { PoiServices } from "../../../../services/poi.services";
import { GeolocationServices } from "../../../../services/geolocation.services";
import { DirectionService } from "../../../../services/direction.service";
import { IndoorDirectionsService } from "../../../../services/indoorDirections.service";
import { By } from "@angular/platform-browser";

describe("ModalDirectionsComponent ", () => {
  let component: ModalDirectionsComponent;
  let fixture: ComponentFixture<ModalDirectionsComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), NgPipesModule, IonicModule.forRoot()],
      declarations: [ModalDirectionsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        StatusBar,
        SplashScreen,
        Geolocation,
        GeolocationServices,
        UserServices,
        PoiServices,
        DirectionService,
        IndoorDirectionsService,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: FirestoreSettingsToken, useValue: {} }
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDirectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    // component.dismiss();
    expect(component).toBeTruthy();
  });
  it("should create the component on init", () => {
    component.ngOnInit();
    fixture.detectChanges()
    expect(component).toBeTruthy();
  });
  it("should test dismiss()", () => {
    fixture.detectChanges();
    const spyClose = spyOn(component, "dismiss");
    let dismiss = fixture.debugElement.query(
      By.css("ion-button.dismissButton")
    );
    dismiss.triggerEventHandler("click", null);
    fixture.detectChanges();
    expect(spyClose).toHaveBeenCalled();
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
