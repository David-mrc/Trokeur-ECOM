import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TrockeurUserComponent } from './list/trockeur-user.component';
import { TrockeurUserDetailComponent } from './detail/trockeur-user-detail.component';
import { TrockeurUserUpdateComponent } from './update/trockeur-user-update.component';
import TrockeurUserResolve from './route/trockeur-user-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const trockeurUserRoute: Routes = [
  {
    path: '',
    component: TrockeurUserComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TrockeurUserDetailComponent,
    resolve: {
      trockeurUser: TrockeurUserResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TrockeurUserUpdateComponent,
    resolve: {
      trockeurUser: TrockeurUserResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TrockeurUserUpdateComponent,
    resolve: {
      trockeurUser: TrockeurUserResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default trockeurUserRoute;
