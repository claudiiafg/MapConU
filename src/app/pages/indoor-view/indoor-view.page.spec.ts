import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IndoorViewPage } from './indoor-view.page';

describe('IndoorViewPage', () => {
  let component: IndoorViewPage;
  let fixture: ComponentFixture<IndoorViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IndoorViewPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IndoorViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
