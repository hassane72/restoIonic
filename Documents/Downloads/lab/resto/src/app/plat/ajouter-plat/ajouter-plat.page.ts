import { Component, OnInit } from '@angular/core';
import {Plat} from 'src/app/models/plat';
import {PlatsService} from '../../services/plats.service';
import {ToastController} from '@ionic/angular';
import {Router} from '@angular/router';


@Component({
  selector: 'app-ajouter-plat',
  templateUrl: './ajouter-plat.page.html',
  styleUrls: ['./ajouter-plat.page.scss'],
})
export class AjouterPlatPage implements OnInit {

  plat: Plat;
  constructor(private service: PlatsService, public toastController: ToastController, private  route: Router) {
    this.plat = new Plat();
    this.plat.image = '/assets/poisson-braise.jpg';
  }

  ngOnInit() {
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

  ajouterPlat(): void {
    this.service.postPlat(this.plat).subscribe(plat => {
      this.presentToast('Plat ajouter avec success');
      this.route.navigate(['/members/plat']);
    }, error => {

    });
  }

}
