import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'trade-object',
        data: { pageTitle: 'trokeurApp.tradeObject.home.title' },
        loadChildren: () => import('./trade-object/trade-object.routes'),
      },
      {
        path: 'generic-image',
        data: { pageTitle: 'trokeurApp.genericImage.home.title' },
        loadChildren: () => import('./generic-image/generic-image.routes'),
      },
      {
        path: 'trockeur-user',
        data: { pageTitle: 'trokeurApp.trockeurUser.home.title' },
        loadChildren: () => import('./trockeur-user/trockeur-user.routes'),
      },
      {
        path: 'object-category',
        data: { pageTitle: 'trokeurApp.objectCategory.home.title' },
        loadChildren: () => import('./object-category/object-category.routes'),
      },
      {
        path: 'trade-offer',
        data: { pageTitle: 'trokeurApp.tradeOffer.home.title' },
        loadChildren: () => import('./trade-offer/trade-offer.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
