import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PoiPopoverComponent } from './poi-popover.component';

describe('PoiPopoverComponent', () => {
  let component: PoiPopoverComponent;
  let fixture: ComponentFixture<PoiPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PoiPopoverComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PoiPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
