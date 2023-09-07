import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TradeObjectComponent } from './list/trade-object.component';
import { TradeObjectDetailComponent } from './detail/trade-object-detail.component';
import { TradeObjectUpdateComponent } from './update/trade-object-update.component';
import TradeObjectResolve from './route/trade-object-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const tradeObjectRoute: Routes = [
  {
    path: '',
    component: TradeObjectComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TradeObjectDetailComponent,
    resolve: {
      tradeObject: TradeObjectResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TradeObjectUpdateComponent,
    resolve: {
      tradeObject: TradeObjectResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TradeObjectUpdateComponent,
    resolve: {
      tradeObject: TradeObjectResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default tradeObjectRoute;
