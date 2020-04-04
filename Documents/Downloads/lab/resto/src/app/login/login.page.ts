import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {AlertController} from '@ionic/angular';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  validation_messages = {
    name: [
      { type: 'required', message: 'Champs Obligatoire.' }
    ]
  };
  constructor(
      private auth: AuthService,
      private router: Router,
      private alertCtrl: AlertController,
      private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      identifier: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }
  ionViewWillEnter() {
      if ( this.auth.getUser() != null) {
        this.router.navigateByUrl('/members');
      }
      this.loginForm.reset();

  }
  login(user: any) {
    console.log(user);
    this.auth.login(user).subscribe(async res => {
        this.router.navigateByUrl('/members');
        console.log(res);
    },
        async error => {
          const alert = await this.alertCtrl.create({
            header: 'Login Failed',
            message: 'Wrong credentials.',
            buttons: ['OK']
          });
          await alert.present();
        });
  }
}
