import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DisplayCalendarsPopoverComponent } from './display-calendars-popover.component';

describe('DisplayCalendarsPopoverComponent', () => {
  let component: DisplayCalendarsPopoverComponent;
  let fixture: ComponentFixture<DisplayCalendarsPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayCalendarsPopoverComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayCalendarsPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
