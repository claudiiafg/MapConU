import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OutdoorNavigationSideButtonsComponent } from './outdoor-navigation-side-buttons.component';

describe('OutdoorNavigationSideButtonsComponent', () => {
  let component: OutdoorNavigationSideButtonsComponent;
  let fixture: ComponentFixture<OutdoorNavigationSideButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutdoorNavigationSideButtonsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OutdoorNavigationSideButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
