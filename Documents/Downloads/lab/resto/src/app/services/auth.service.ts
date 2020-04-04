import { Injectable } from '@angular/core';
import {User} from '../models/user';
import { Storage } from '@ionic/storage';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, from, Observable, of} from 'rxjs';
import {Platform} from '@ionic/angular';
import {Router} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {environment} from '../../environments/environment';

const TOKEN_KEY = 'jwt-token';
const USER_DATA = 'user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  redirectUrl: string;
  url = environment.URL;
  public user: Observable<any>;
  private userData = null;
  constructor(private http: HttpClient, private storage: Storage, private plt: Platform, private router: Router ) {
    this.loadStoredToken();
  }

  loadStoredToken() {
    let platformObs = from(this.plt.ready());

    this.user = platformObs.pipe(
        switchMap(() => {
          return from(this.storage.get(USER_DATA));
        }),
        map(token => {
          if (token) {
            console.log(token);
            this.userData = token;
            return true;
          } else {
            return null;
          }
        })
    );
  }

  login(user: User): Observable<any> {
    return this.http.post(this.url + '/auth/local', user).pipe(
        map( (res: any) => {
          console.log(res.user);
          const storageObs = from(this.storage.set(USER_DATA, res.user));
          this.userData = res.user;
          this.user = of(true);
          return res;
        })
    );
  }
  register(user: any) {
    return this.http.post(this.url + '/auth/local/register', user).pipe();
  }
  getUserByEmail(email: any) {
      return this.http.get(this.url + '/users?email_eq=' + email).pipe();
  }
  resetPassword(id: number, user: any) {
      return this.http.put(this.url + '/users/' + id, user).pipe();
  }
    updateProfile(id: number, user: any) {
        return this.http.put(this.url + '/users/' + id, user).pipe(
            map( (res: any) => {
                console.log(res);
                const storageObs = from(this.storage.set(USER_DATA, res));
                this.userData = res.user;
                this.user = of(true);
                return res;
            })
        );
    }
  getUser() {
    return this.userData;
  }
  logout() {
    this.storage.remove(USER_DATA).then(() => {
        this.userData = null;
        this.user = of(false);
        this.router.navigateByUrl('/');
    });
  }
}
