import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AlertController, LoadingController} from '@ionic/angular';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  validation_messages = {
    name: [
      { type: 'required', message: 'Champs Obligatoire.' }
    ]
  };
  constructor(public loadingController: LoadingController, private formBuilder: FormBuilder, private route: Router,  private alertCtrl: AlertController, private auth: AuthService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username : ['', [Validators.required, Validators.minLength(3)]],
      email : ['', [Validators.required, Validators.email]],
      password : ['', [Validators.required]] });
  }
 async register(userInfo: any) {
    this.auth.register(userInfo).subscribe(async data => {
      // tslint:disable-next-line:variable-name
      const loading = await this.loadingController.create({
        message: 'Please wait...',
        duration: 2000
      });
      await loading.present();
      const alert_1 = await this.alertCtrl.create({
        header: 'Login Failed',
        message: 'Nom d\'utilisateur déjà utilisé!',
        buttons: ['OK']
      });
      await alert_1.present();
      this.route.navigateByUrl('/');
    }, async error => {
      switch (error.error.message[0].messages[0].id) {
        case 'Auth.form.error.email.taken':
          const alert = await this.alertCtrl.create({
            header: 'Login Failed',
            message: 'Email déjà utilisé!',
            buttons: ['OK']
          });
          await alert.present();
          break;
        case 'Auth.form.error.username.taken':
          // tslint:disable-next-line:variable-name
           let alert_1 = await this.alertCtrl.create({
            header: 'Login Failed',
            message: 'Nom d\'utilisateur déjà utilisé!',
            buttons: ['OK']
          });
           await alert_1.present();
           break;
        default:
          // tslint:disable-next-line:variable-name
          const alert_2 = await this.alertCtrl.create({
            header: 'Login Failed',
            message: 'Une erreur est survenue!',
            buttons: ['OK']
          });
          await alert_2.present();
          break;
      }
    });
  }
}
