import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertController, IonInfiniteScroll, ToastController} from '@ionic/angular';
import {MenusService} from '../services/menus.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.page.html',
  styleUrls: ['menu.page.scss']
})
export class MenuPage implements OnInit {

  offset = 0;
  // @ts-ignore
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;


  menus: any = [];

  constructor(private menusService: MenusService, private toastController: ToastController,
              private alertController: AlertController, private router: Router) {}

  ngOnInit()  {}
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'danger',
      position: 'top'
    });
    toast.present();
  }
  loadMenu(loadMore = false, event?) {
    if (loadMore) {
      this.offset += 10;
    }

    this.menusService.getMenus(this.offset).subscribe(res => {
      this.menus = [...this.menus, ...res];

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
    this.menus = [];
    this.loadMenu();
  }

  modifierMenu(id: any) {
    this.router.navigate(['/members/menu/modifier', id ]);
    return false;
  }

  async delete(poke: any) {
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
            this.menusService.deleteMenu(poke.id).subscribe(menu => {
              this.presentToast('Plat supprimer avec success');
              location.reload();
            });
          }
        }
      ],

    });
    await alert.present();
  }

  detailMenu(id: any) {
    this.router.navigate(['/members/menu/detail',id]);
  }
}
