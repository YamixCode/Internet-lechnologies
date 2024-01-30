import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'good',
        loadChildren: () => import('./good/good.module').then(m => m.GoodModule),
      },
      {
        path: 'order',
        loadChildren: () => import('./order/order.module').then(m => m.OrderModule),
      },
    ]),
  ],
})
export class EntityRoutingModule {}
