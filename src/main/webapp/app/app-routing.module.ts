import { TradeObjectUpdateComponent } from './entities/trade-object/update/trade-object-update.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';

import HomeComponent from './home/home.component';
import NavbarComponent from './layouts/navbar/navbar.component';
import LoginComponent from './login/login.component';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ListProductComponent } from './components/list-product/list-product.component';
import { MyProductsComponent } from './components/my-products/my-products.component';
import { HistoriqueTransactionsComponent } from './historique/historique-transactions/historique-transactions.component';
import { TransactionProposeComponent } from './historique/transaction-propose/transaction-propose.component';
import { TransactionRecueComponent } from './historique/transaction-recue/transaction-recue.component';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          component: HomeComponent,
          title: 'home.title',
        },
        {
          path: '',
          component: NavbarComponent,
          outlet: 'navbar',
        },
        {
          path: 'admin',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./admin/admin-routing.module'),
        },
        {
          path: 'account',
          loadChildren: () => import('./account/account.route'),
        },
        {
          path: 'login',
          component: LoginComponent,
          title: 'login.title',
        },
        {
          path: 'historique',
          component: HistoriqueTransactionsComponent,
          title: 'historiqueTransaction.title',
        },
        {
          path: 'troks-proposes',
          component: TransactionProposeComponent,
          title: 'transactionPropose.title',
        },
        {
          path: 'troks-recus',
          component: TransactionRecueComponent,
          title: 'transactionsRecues.title',
        },
        {
          path: '',
          loadChildren: () => import(`./entities/entity-routing.module`).then(({ EntityRoutingModule }) => EntityRoutingModule),
        },
        {
          path: 'product',
          component: ListProductComponent,
        },
        {
          path: 'account/my-products',
          component: MyProductsComponent,
          title: 'MyProductsComponent.title',
        },
        ...errorRoute,
      ],
      { enableTracing: DEBUG_INFO_ENABLED, bindToComponentInputs: true }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
