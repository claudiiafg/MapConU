import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {IndoorNavigationToolbarComponent} from './indoor-navigation-toolbar.component';

describe('IndoorNavigationToolbarComponent', () => {
    let component: IndoorNavigationToolbarComponent;
    let fixture: ComponentFixture<IndoorNavigationToolbarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IndoorNavigationToolbarComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(IndoorNavigationToolbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
