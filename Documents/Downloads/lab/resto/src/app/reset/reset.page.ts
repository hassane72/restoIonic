import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {ConfirmPassword} from '../helpers/confirm-password.validator';
import {User} from '../models/user';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.page.html',
  styleUrls: ['./reset.page.scss'],
})
export class ResetPage implements OnInit {

  resetForm: FormGroup;
  user: User = new User();
  validation_messages = {
    name: [
      { type: 'required', message: 'Champs Obligatoire.' }
    ]
  };
  // tslint:disable-next-line:max-line-length
  constructor(public loadingController: LoadingController, private formBuilder: FormBuilder, private route: Router,  private alertCtrl: AlertController, private auth: AuthService) { }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      email : ['', [Validators.required, Validators.email]],
      password : ['', [Validators.required]],
      confirmPassword: ['', Validators.required]
    }, {validators: ConfirmPassword.MatchPassword  });
  }

  reset(userInfo: any) {
    console.log(userInfo);
    this.user.email = userInfo.email;
    this.user.password = userInfo.password;
    console.log(this.user);
    this.auth.getUserByEmail(this.user.email).subscribe(async ( res: any) => {
          console.log(res.id);
          const result = [...res, ...[]];
          console.log(result);
          if (result.length > 0) {
           console.log(result[0].id);
           this.auth.resetPassword(+result[0].id, this.user).subscribe( async item => {
              console.log(item);
              const alert_2 = await this.alertCtrl.create({
               header: 'Success',
               message: 'Operation reussi',
               buttons: ['OK']
             });
              await alert_2.present();
              this.route.navigateByUrl('/');
            });
          } else {
        const alert_1 = await this.alertCtrl.create({
          header: 'Login Failed',
          message: 'Email incorrect',
          buttons: ['OK']
        });
        await alert_1.present();
      }
    },
        async err => {
     // console.log(err);
        });

  }

}
