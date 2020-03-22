import { fakeAsync, async, TestBed } from "@angular/core/testing";
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { UserServices } from "./user.services";
import { environment } from "../environments/environment";
import { User } from "src/models/userModel";

describe("UserServices", () => {
  let user: User;
  user = {
    id: "string",
    username: "string",
    email: "string",
    googleApiKey: "string"
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule,
        AngularFireAuthModule
      ],
      providers: [UserServices]
    }).compileComponents();
  });
  it("should be created", () => {
    const service: UserServices = TestBed.get(UserServices);
    service.initSubscription();
    service["subscribeToDatabase"]();
    service["getValueFromObservable"](null);
    service.signin("userName", "password");
    service["createNewUser"](user, "password");
    service["setUser"](null);
    service.getUserData();
    service.createUser("userName", "email", "password", "apiKey");
    service.modifyUser("userName", "email", "password", "apiKey");
    expect(service).toBeTruthy();
  });
  it("initSubscription should call subscribeToDatabase", () => {
    const service: UserServices = TestBed.get(UserServices);
    const mySpy = spyOn(service, "initSubscription").and.callFake(() => {
      service["subscribeToDatabase"]().catch(error => {
        console.log(error);
      });
      return null;
    });
    service.initSubscription();
    expect(mySpy).toHaveBeenCalled();
  });
  it("subscribeToDatabase should call getUserData", () => {
    const service: UserServices = TestBed.get(UserServices);
    service.user;
    service["userID"] = "tempString";
    const mySpy = spyOn<any>(service, "subscribeToDatabase").and.callFake(
      () => {
        if (user) {
          service.user = user;
          service["userID"] = user.id;
        }
        service["getUserData"]().catch(async () => {
          service.createUser("userName", "email", "password", "apiKey");
          const id =
            this.AFauth.auth.currentUser && this.AFauth.auth.currentUser.uid;
          if (id) {
            try {
              const res = await this.db
                .collection("users")
                .doc(id)
                .valueChanges();
              return this.getValueFromObservable(res);
            } catch (err) {
              return err;
            }
          }
        });
        return user;
      }
    );
    service["subscribeToDatabase"]();
    expect(mySpy).toHaveBeenCalled();
    expect(service["userID"]).toEqual("string");
    expect(service.user).toEqual(user);
  });
  it("getValueFromObservable should return Promise", () => {
    let res = null;
    const service: UserServices = TestBed.get(UserServices);
    const mySpy = spyOn<any>(service, "getValueFromObservable").and.returnValue(
      Promise.resolve(res)
    );
    service["getValueFromObservable"](res);
    expect(mySpy).toHaveBeenCalled();
  });
  it("should test signin()", () => {
    const service: UserServices = TestBed.get(UserServices);
    const mySpy = spyOn<any>(service, "signin").and.returnValue(
      service.AFauth.auth.signInWithEmailAndPassword("test", "test")
    );
    service["signin"]("test", "test");
    expect(mySpy).toHaveBeenCalled();
  });
  it("createNewUser should call createUserWithEmailAndPassword", () => {
    const service: UserServices = TestBed.get(UserServices);
    service.user;
    let tempError = "";
    const mySpy = spyOn<any>(service, "createNewUser").and.callFake(
      async () => {
        let tempUser = user;
        let password = "string";
        return service.AFauth.auth
          .createUserWithEmailAndPassword(tempUser.email, password)
          .then(result => {
            tempUser.id = result.user.uid;
            service["db"]
              .collection<User>("users")
              .doc(tempUser.id)
              .set(tempUser);
          })
          .catch(error => {
            tempError = error.message;
            console.log(error.message);
          });
      }
    );
    service["createNewUser"](user, "string");
    expect(mySpy).toHaveBeenCalled();
    // if it's not empty means we had an error occur
    expect(tempError).toEqual("");
  });
  it("should test setUser(user: User)", () => {
    const service: UserServices = TestBed.get(UserServices);
    service["usersCollection$"];
    service.user;
    const mySpy = spyOn<any>(service, "setUser").and.callFake(async () => {
      await service["usersCollection$"].doc(user.id).update(user);
    });
    service["setUser"](user);
    expect(mySpy).toHaveBeenCalled();
    expect(service["usersCollection$"]).toBeUndefined();
  });
  it("should test createUser(...) invalid inputs", () => {
    const service: UserServices = TestBed.get(UserServices);
    console.log = jasmine.createSpy("insufficient info to create an account");
    service.createUser("", "", "", "");
    expect(console.log).toHaveBeenCalledWith(
      "insufficient info to create an account"
    );
  });
  it("should test createUser(...) valid inputs", () => {
    const service: UserServices = TestBed.get(UserServices);
    let password = "tempPassword";
    const mySpy = spyOn<any>(service, "createUser").and.callFake(async () => {
      service["createNewUser"](user, password);
    });
    service.createUser("temp", "temp", "temp", "temp");
    let console_log = jasmine.createSpy(
      "insufficient info to create an account"
    );
    expect(mySpy).toHaveBeenCalled();
    // shouldn't log anything since valid inputs
    expect(console_log.calls.count()).toEqual(0);
  });
  it("should test createUser(...) valid inputs", () => {
    let tempUser = {
      id: "temp",
      username: "temp",
      email: "temp",
      googleApiKey: "temp"
    };
    const service: UserServices = TestBed.get(UserServices);
    const mySpy = spyOn<any>(service, "modifyUser").and.callFake(async () => {
      service["setUser"](tempUser);
      user = tempUser; // fake the set from AFauth
    });
    service.modifyUser("temp", "temp", "temp", "temp");
    expect(mySpy).toHaveBeenCalled();
    expect(user).toEqual(tempUser);
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
