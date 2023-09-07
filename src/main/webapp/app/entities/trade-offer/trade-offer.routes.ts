import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TradeOfferComponent } from './list/trade-offer.component';
import { TradeOfferDetailComponent } from './detail/trade-offer-detail.component';
import { TradeOfferUpdateComponent } from './update/trade-offer-update.component';
import TradeOfferResolve from './route/trade-offer-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const tradeOfferRoute: Routes = [
  {
    path: '',
    component: TradeOfferComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TradeOfferDetailComponent,
    resolve: {
      tradeOffer: TradeOfferResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TradeOfferUpdateComponent,
    resolve: {
      tradeOffer: TradeOfferResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TradeOfferUpdateComponent,
    resolve: {
      tradeOffer: TradeOfferResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default tradeOfferRoute;
