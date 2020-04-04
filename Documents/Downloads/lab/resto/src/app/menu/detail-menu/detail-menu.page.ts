import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Menu} from '../../models/menu';
import {MenusService} from '../../services/menus.service';
import {Plat} from "../../models/plat";
import {Commande} from "../../models/commande";
import {AuthService} from "../../services/auth.service";
import {CommandesService} from "../../services/commandes.service";
import {LoadingController} from "@ionic/angular";

@Component({
  selector: 'app-detail-menu',
  templateUrl: './detail-menu.page.html',
  styleUrls: ['./detail-menu.page.scss'],
})
export class DetailMenuPage implements OnInit {

  menu: Menu = new Menu();
  plats: Array<Plat> = [];
  user: any;
  isSubmit = false;
  slideOpts = {
    autoplay: {
      delay: 2000,
      disableOnInteraction: false
    }
  };
  constructor(private auth: AuthService, private route: ActivatedRoute,
              private router: Router, private menusService: MenusService,
              private commandeService: CommandesService, public loadingController: LoadingController) {  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.menusService.getMenu(+id).subscribe( async menu => {
      this.menu = await menu;
    });
    this.user = this.auth.getUser();
  }

}
