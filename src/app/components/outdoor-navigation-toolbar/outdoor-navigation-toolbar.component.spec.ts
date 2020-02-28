import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OutdoorNavigationToolbarComponent } from './outdoor-navigation-toolbar.component';

describe('OudtoorNavigationToolbarComponent', () => {
  let component: OutdoorNavigationToolbarComponent;
  let fixture: ComponentFixture<OutdoorNavigationToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OutdoorNavigationToolbarComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OutdoorNavigationToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
