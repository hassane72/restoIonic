import {Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { PlatsService } from '../services/plats.service';
import { Plat } from '../Models/plat';
import {AlertController, IonInfiniteScroll, ToastController} from '@ionic/angular';


@Component({
  selector: 'app-plat',
  templateUrl: 'plat.page.html',
  styleUrls: ['plat.page.scss']
})
export class PlatPage implements OnInit {
  offset = 0;
  // @ts-ignore
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  plats: any = [];
  // tslint:disable-next-line:max-line-length
  constructor(private service: PlatsService, private router: Router, private alertController: AlertController, private toastController: ToastController) {}
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'danger',
      position: 'top'
    });
    toast.present();
  }
  modifierPlat(id: number) {
    this.router.navigate(['/members/plat/modifier', id ]);
  }

  async delete(plat: Plat) {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'This is an alert message.',
      buttons: [{
        text : 'Cancel',
        role: 'Cancel',

      },
      {
        text: 'Confirm',
        handler: data => {
          // tslint:disable-next-line:no-shadowed-variable
          this.service.deletePlat(plat.id).subscribe(plat => {
            this.presentToast('Plat supprimer avec success');
            location.reload();
            });
        }
      }
  ],

    });
    await alert.present();
  }

  ngOnInit() {
  }
  loadPlat(loadMore = false, event?) {
    if (loadMore) {
      this.offset += 1;
    }

    this.service.getPlats(this.offset).subscribe(res => {
      this.plats = [...this.plats, ...res];

      if (event) {
        event.target.complete();
      }

      // Optional
      // tslint:disable-next-line:triple-equals
      if (this.offset == 125) {
        this.infiniteScroll.disabled = true;
      }
    });
  }

  public ionViewWillEnter(): void {
    this.plats = [];
    this.loadPlat();
  }
}
