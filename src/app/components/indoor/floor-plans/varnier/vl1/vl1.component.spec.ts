import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Vl1FloorPlanComponent } from "./vl1.component";

describe("Vl1FloorPlanComponent ", () => {
  let component: Vl1FloorPlanComponent;
  let fixture: ComponentFixture<Vl1FloorPlanComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [Vl1FloorPlanComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(Vl1FloorPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should set events after view init", () => {
    let tempComponent = component["events"];
    spyOn(tempComponent, "publish").and.callFake(() => {
      return null;
    });
    component.ngAfterViewInit();
    expect(tempComponent.publish).toHaveBeenCalled();
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
