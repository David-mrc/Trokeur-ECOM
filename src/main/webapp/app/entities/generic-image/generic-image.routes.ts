import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GenericImageComponent } from './list/generic-image.component';
import { GenericImageDetailComponent } from './detail/generic-image-detail.component';
import { GenericImageUpdateComponent } from './update/generic-image-update.component';
import GenericImageResolve from './route/generic-image-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const genericImageRoute: Routes = [
  {
    path: '',
    component: GenericImageComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GenericImageDetailComponent,
    resolve: {
      genericImage: GenericImageResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GenericImageUpdateComponent,
    resolve: {
      genericImage: GenericImageResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GenericImageUpdateComponent,
    resolve: {
      genericImage: GenericImageResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default genericImageRoute;
