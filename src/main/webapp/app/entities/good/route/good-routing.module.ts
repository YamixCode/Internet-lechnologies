import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GoodComponent } from '../list/good.component';
import { GoodDetailComponent } from '../detail/good-detail.component';
import { GoodUpdateComponent } from '../update/good-update.component';
import { GoodRoutingResolveService } from './good-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const goodRoute: Routes = [
  {
    path: '',
    component: GoodComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    //canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GoodDetailComponent,
    resolve: {
      good: GoodRoutingResolveService,
    },
    //canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GoodUpdateComponent,
    resolve: {
      good: GoodRoutingResolveService,
    },
    //canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GoodUpdateComponent,
    resolve: {
      good: GoodRoutingResolveService,
    },
    //canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(goodRoute)],
  exports: [RouterModule],
})
export class GoodRoutingModule {}
