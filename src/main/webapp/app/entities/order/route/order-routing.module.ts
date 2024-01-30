import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrderComponent } from '../list/order.component';
import { OrderDetailComponent } from '../detail/order-detail.component';
import { OrderUpdateComponent } from '../update/order-update.component';
import { OrderRoutingResolveService } from './order-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const orderRoute: Routes = [
  {
    path: '',
    component: OrderComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
  },
  {
    path: ':id/view',
    component: OrderDetailComponent,
    resolve: {
      order: OrderRoutingResolveService,
    },
  },
  {
    path: 'new',
    component: OrderUpdateComponent,
    resolve: {
      order: OrderRoutingResolveService,
    },
  },
  {
    path: ':id/edit',
    component: OrderUpdateComponent,
    resolve: {
      order: OrderRoutingResolveService,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(orderRoute)],
  exports: [RouterModule],
})
export class OrderRoutingModule {}
