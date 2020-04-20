import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MB1FloorPlanComponent } from "./mb1.component";

describe("MB1FloorPlanComponent ", () => {
  let component: MB1FloorPlanComponent;
  let fixture: ComponentFixture<MB1FloorPlanComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [MB1FloorPlanComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(MB1FloorPlanComponent);
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
