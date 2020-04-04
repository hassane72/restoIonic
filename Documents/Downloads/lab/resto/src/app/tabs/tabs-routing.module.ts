import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/members/compte',
    pathMatch: 'full'
  },
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'menu',
        children: [
          {
            path: '',
            loadChildren: () =>
                import('../menu/menu.module').then(m => m.MenuPageModule)
          },
          {
            path: 'detail',
            children: [
              {
                path: ':id',
                loadChildren: () => import('../menu/detail-menu/detail-menu.module').then( m => m.DetailMenuPageModule)
              }
            ]
          },
          {
            path: 'ajouter',
            children: [
              {
                path: '',
                loadChildren: () => import('../menu/ajouter-menu/ajouter-menu.module').then( m => m.AjouterMenuPageModule)
              }
            ]
          },
          {
            path: 'modifier',
            children: [
              {
                path: ':id',
                loadChildren: () => import('../menu/modifier-menu/modifier-menu.module').then( m => m.ModifierMenuPageModule)
              }
            ]
          }
        ]
      },
      {
        path: 'plat',
        children: [
          {
            path: '',
            loadChildren: () =>
                import('../plat/plat.module').then(m => m.PlatPageModule)
          },
          {
            path: 'ajouter',
            children: [
              {
                path: '',
                loadChildren: () =>
                    import('../plat/ajouter-plat/ajouter-plat.module').then(m => m.AjouterPlatPageModule)
              }
            ]
          },
          {
            path: 'modifier',
            children: [
              {
                path: ':id',
                loadChildren: () =>
                    import('../plat/modifier-plat/modifier-plat.module').then(m => m.ModifierPlatPageModule)
              }
            ]
          }
        ]
      },
      {
        path: 'compte',
        children: [
          {
            path: '',
            loadChildren: () =>
                import('../compte/compte.module').then(m => m.ComptePageModule)
          }
        ]
      },
      {
        path: 'commander',
        children: [
          {
            path: '',
            loadChildren: () =>
                import('../commander/commander.module').then(m => m.CommanderPageModule)
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
