import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { UserServices } from './user.services';
import { environment } from '../environments/environment';

describe('UserServices', () => {
  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule,
        AngularFireAuthModule,
      ],
      providers: [
        UserServices,
      ]
    }).compileComponents();
  }));

  it('should be created', () => {
    const service: UserServices = TestBed.get(UserServices);
    expect(service).toBeTruthy();
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
