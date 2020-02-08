import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'src/models/userModel';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UserServices {
  private userID : string;
  public user: User;
	private usersList$ : Observable<User[]> = new Observable<User[]>();
  private usersCollection$ : AngularFirestoreCollection<User>;


  constructor(
    private events: Events,
    public AFauth : AngularFireAuth,
		private db : AngularFirestore,
  ) {}

  initSubscription(){
    this.subscribeToDatabase()
    .catch((error) => {
      console.log(error)
    });
  }

  // Subscribe to database
  private async subscribeToDatabase() : Promise<any> {
    const user = await this.getUserData();
    if(user){
      this.user = user;
      this.userID = user.id;
    }
    this.usersCollection$ = await this.db.collection<User>('users');
    this.usersList$ = this.db.collection<User>('users').valueChanges().pipe(
      map ( changes => {
        return changes.map((user) =>{
            return user;
          });
      })
    )
  }

  private getValueFromObservable(res : any) : any {
    return new Promise( resolve => {
      res.subscribe((data : any) => {
        resolve(data);
      });
    });
  }

  public signin(email : string, password : string) : Promise<any> {
		return this.AFauth.auth.signInWithEmailAndPassword(email, password);
	}


  private async createNewUser(user : User, password : string){
    let tempUser = user;
    return this.AFauth.auth.createUserWithEmailAndPassword(tempUser.email, password)
    .then((result) => {
      tempUser.id = result.user.uid;
      this.db.collection<User>('users').doc(tempUser.id).set(tempUser);
      console.log(result.user);

    }).catch((error) => {
      console.log(error.message);
    })
	}

  // Modify user
	private async setUser(user : User) {
		await this.usersCollection$.doc(user.id).update(user);
	}


  //Helpers
  async getUserData(){
    const id = this.AFauth.auth.currentUser && this.AFauth.auth.currentUser.uid;
		if(id){
			try{
				const res =	await this.db.collection('users').doc(id).valueChanges();
				return this.getValueFromObservable(res);
			} catch(err) {
				return err;
			}
		}
  }

  createUser(userName : string, email : string, password : string, apiKey : string)	{
    if((email && email.length > 0) && (password && password.length > 0)){
      const tempUser : User = {
        id : '',
        username : userName,
        email : email,
        googleApiKey: apiKey
  		}
      this.createNewUser(tempUser, password);
    } else {
      console.log('insufficient info to create an account');
    }

  }

  modifyUser(userID : string, username : string, email : string, apiKey : string){
    const tempUser : User = {
      id : userID,
      username : username,
      email : email,
      googleApiKey: apiKey
    }
    this.setUser(tempUser);
  }

}
