import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IndoorMapComponent } from './indoor-map.component';

describe('IndoorNavigationSideButtonsComponent', () => {
  let component: IndoorMapComponent;
  let fixture: ComponentFixture<IndoorMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IndoorMapComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IndoorMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
