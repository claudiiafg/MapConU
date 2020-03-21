import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterModule } from "@angular/router";
import { H8FloorPlanComponent } from "./h8.component";

describe("H8FloorPlanComponent ", () => {
  let component: H8FloorPlanComponent;
  let fixture: ComponentFixture<H8FloorPlanComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [H8FloorPlanComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(H8FloorPlanComponent);
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
