import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MenusService} from '../../services/menus.service';
import {Menu} from '../../models/menu';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PlatsService} from '../../services/plats.service';
import {Plat} from '../../models/plat';
import {ToastController} from "@ionic/angular";

@Component({
  selector: 'app-modifier-menu',
  templateUrl: './modifier-menu.page.html',
  styleUrls: ['./modifier-menu.page.scss'],
})
export class ModifierMenuPage implements OnInit {
  menuId: number;
  plats: Array<Plat> = [];
  // tslint:disable-next-line:variable-name
  plats_id = [];
  menu: Menu;
  // tslint:disable-next-line:variable-name
  validations_form: FormGroup;
  validation_messages = {
    name: [
      { type: 'required', message: 'Title is required.' }
    ]
  };
  // tslint:disable-next-line:max-line-length
  constructor(private route: ActivatedRoute, private router: Router, public formBuilder: FormBuilder, private menusService: MenusService,
              private platsService: PlatsService, private toastController: ToastController) { }

  async ngOnInit() {
    this.menuId = Number(this.route.snapshot.paramMap.get('id'));
    await this.platsService.getAllPlats().toPromise().then(res => {
      this.plats = [...res];
    });
    console.log(this.plats);
    await this.menusService.getMenu(this.menuId).toPromise().then(menu => this.menu = menu ).catch();
    for(let plat of this.menu.plats) {
      this.plats_id.push(plat.id);
    }
    this.validations_form = this.formBuilder.group({
      title: new FormControl(this.menu.title, Validators.required),
      plats: new FormControl([...this.plats_id], Validators.required),
    });
  }
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'success',
      position: 'top'
    });
    toast.present();
  }
  onSubmit(value: any) {
    console.log(value);
    this.menusService.updatePlat(this.menuId, value).subscribe(res => {
      console.log(res);
      this.presentToast('Menu modifier avec success');
      this.router.navigate(['/members/menu']);
    });
  }
}
