import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterModule } from "@angular/router";
import { H9FloorPlanComponent } from "./h9.component";

describe("H9FloorPlanComponent ", () => {
  let component: H9FloorPlanComponent;
  let fixture: ComponentFixture<H9FloorPlanComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [H9FloorPlanComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(H9FloorPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should set events after view init", () => {
    let tempComponent = component["events"];
    spyOn(tempComponent, "publish").and.callThrough();
    component.ngAfterViewInit();
    expect(tempComponent.publish).toHaveBeenCalled();
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
