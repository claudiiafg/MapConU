import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OutdoorViewPage } from './outdoor-view.page';

describe('OutdoorViewPage', () => {
  let component: OutdoorViewPage;
  let fixture: ComponentFixture<OutdoorViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OutdoorViewPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OutdoorViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
