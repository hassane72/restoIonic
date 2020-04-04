import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PlatsService} from '../../services/plats.service';
import {Plat} from '../../models/plat';
import {ToastController} from "@ionic/angular";

@Component({
  selector: 'app-modifier-plat',
  templateUrl: './modifier-plat.page.html',
  styleUrls: ['./modifier-plat.page.scss'],
})
export class ModifierPlatPage implements OnInit {
  nomControl: FormControl;
  prixControl: FormControl;
  descriptionControl: FormControl;
  formGroup: FormGroup;
  platId: number;
  plat: Plat;
  constructor(private builder: FormBuilder, private route: ActivatedRoute, private service: PlatsService, private router: Router,
              private toastController: ToastController) {
    this.platId = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getPlat(this.platId).subscribe(plat => {
      this.plat = plat;
      this.nomControl = new FormControl(this.plat.nom, [Validators.required, Validators.minLength(2)]);
      this.prixControl = new FormControl(this.plat.prix, Validators.required);
      this.descriptionControl = new FormControl(this.plat.description);
      this.formGroup = this.builder.group({
        nom: this.nomControl,
        prix: this.prixControl,
        Description: this.descriptionControl
      });
    });
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
  modifier(): void {
    this.service.updatePlat(this.plat.id, this.formGroup.value).subscribe(plat => {
      this.presentToast('Plat modifier avec success');
      this.router.navigate(['/members/plat']); });
  }
}
