import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IndoorTimeOfArrivalComponent } from './indoor-time-of-arrival.component';

describe('IndoorTimeOfArrivalComponent', () => {
  let component: IndoorTimeOfArrivalComponent;
  let fixture: ComponentFixture<IndoorTimeOfArrivalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndoorTimeOfArrivalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IndoorTimeOfArrivalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
