import { Component, OnInit } from '@angular/core';
import {ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {Menu} from '../../models/menu';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PlatsService} from '../../services/plats.service';
import {Plat} from '../../models/plat';
import {MenusService} from '../../services/menus.service';

@Component({
  selector: 'app-ajouter-menu',
  templateUrl: './ajouter-menu.page.html',
  styleUrls: ['./ajouter-menu.page.scss'],
})
export class AjouterMenuPage implements OnInit {
  menu: Menu;
  plats: Array<Plat> = [];
  // tslint:disable-next-line:variable-name
  plats_add: Array<Plat> = [];
  // tslint:disable-next-line:variable-name
  validations_form: FormGroup;
  genders: Array<string>;
  validation_messages = {
    name: [
      { type: 'required', message: 'Title is required.' }
    ]
  };
    // tslint:disable-next-line:max-line-length
  constructor(private menusService: MenusService, public toastController: ToastController, private  route: Router,  public formBuilder: FormBuilder, private platsService: PlatsService) {
    this.menu = new Menu();
    this.menu.datemenu = Date.now();
  }

  ngOnInit() {
    this.platsService.getAllPlats().subscribe(res => {
      this.plats = [...res];
    });
    this.genders = [
      'Male',
      'Female'
    ];
    this.validations_form = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      plats: new FormControl([this.plats[0]], Validators.required),
    });
  }

 async onSubmit(values) {
    this.menu.title = values.title;
    for (const id of values.plats) {
      await this.platsService.getPlat(+id).toPromise().then(res => this.plats_add.push(res)).catch( error => console.log(error));
    }
    this.menu.plats = this.plats_add;
    this.menusService.postMenu(this.menu).subscribe(res => {
      console.log(res);
      this.presentToast('Plat ajouter avec success');
      this.route.navigate(['/members/menu']);
    });
  }
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'success',
      position: 'top'
    });
    toast.present();
  }
  ajouterMenu() {
    console.log(this.menu);
  }

}
