import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AjouterMenuPage } from './ajouter-menu.page';

const routes: Routes = [
  {
    path: '',
    component: AjouterMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AjouterMenuPageRoutingModule {}
