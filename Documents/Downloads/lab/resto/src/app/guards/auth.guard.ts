import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../services/auth.service';
import {AlertController} from '@ionic/angular';
import {map, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements  CanActivate {
  constructor(private router: Router, private auth: AuthService, private alertCtrl: AlertController) { }

  // tslint:disable-next-line:max-line-length
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.user.pipe(
        take(1),
        map(user => {
          console.log(user + ' ' + this.auth.getUser());
          if (!user) {
            this.alertCtrl.create({
              header: 'Unauthorized',
              message: 'You are not allowed to access that page.',
              buttons: ['OK']
            }).then(alert => alert.present());

            this.router.navigateByUrl('/');
            return false;
          } else {
            return true;
          }
        })
    );
  }
  checkConnexion(): boolean {
    if (window.localStorage.getItem('token')) {
      return true;
    }
    this.router.navigate(['login']);
    return false;
  }
}
