import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {DateFormatPipe} from '../helpers/dateFormatPipe.pipe';
import {MenusService} from '../services/menus.service';
import {Plat} from '../models/plat';
import {CommandesService} from '../services/commandes.service';
import {LoadingController} from '@ionic/angular';
import {Commande} from '../models/commande';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-commander',
  templateUrl: './commander.page.html',
  styleUrls: ['./commander.page.scss'],
})
export class CommanderPage implements OnInit {

  menusDay: any = [];
  menu: any = [];
  plats: Array<Plat> = [];
  user: any;
  isSubmit = false;
  slideOpts = {
    autoplay: {
      delay: 2000,
      disableOnInteraction: false
    }
  };
  constructor(private dateFormatPipe: DateFormatPipe, private menusService: MenusService,
              private router: Router, private commandeService: CommandesService,
              public loadingController: LoadingController, private auth: AuthService, ) { }

  ngOnInit() {
    this.user = this.auth.getUser();
  }

  async ionViewWillEnter() {
    const result = this.menusService.getMenuByDays().toPromise();
    await result.then((res) => {
      this.menusDay = res;
    }).catch();
    const date = this.dateFormatPipe.transform(Date.now());
    console.log(date);
    for (let i = 0; i < this.menusDay.length; i++) {
     const datemenu = this.dateFormatPipe.transform(Date.parse(this.menusDay[i].datemenu));
     if (date == datemenu) {
       console.log(this.menusDay[i]);
       this.menu = this.menusDay[i];
       break;
     }
   }
    this.commandeService.getCommandeByMenu(this.menu).subscribe( commande => {
      this.isSubmit = true;
    });
  }
  addPlat(plat: Plat) {
    if (!this.verifExist(plat)) {
      this.plats.push(plat);
    }
  }

  removePlat(plat: Plat) {
    if (this.verifExist(plat)) {
      this.plats = this.plats.filter(item => item !== plat);
    }
  }
  submitCommande(menu: any) {
    const commande = new Commande();
    commande.user = this.user;
    commande.menu = menu;
    commande.plats = this.plats;
    console.log(commande);
    this.commandeService.postCommande(commande).subscribe( async res => {
          const loading = await this.loadingController.create({
            message: 'Please wait...',
            duration: 2000
          });
          await loading.present();
          this.isSubmit = true;
        },
        err => {
          console.log(err);
        });
  }
  verifExist(plat: Plat) {
    return this.plats.includes(plat);
  }
}
