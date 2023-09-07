import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ObjectCategoryComponent } from './list/object-category.component';
import { ObjectCategoryDetailComponent } from './detail/object-category-detail.component';
import { ObjectCategoryUpdateComponent } from './update/object-category-update.component';
import ObjectCategoryResolve from './route/object-category-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const objectCategoryRoute: Routes = [
  {
    path: '',
    component: ObjectCategoryComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ObjectCategoryDetailComponent,
    resolve: {
      objectCategory: ObjectCategoryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ObjectCategoryUpdateComponent,
    resolve: {
      objectCategory: ObjectCategoryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ObjectCategoryUpdateComponent,
    resolve: {
      objectCategory: ObjectCategoryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default objectCategoryRoute;
