import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { GoodComponent } from './list/good.component';
import { GoodDetailComponent } from './detail/good-detail.component';
import { GoodUpdateComponent } from './update/good-update.component';
import { GoodDeleteDialogComponent } from './delete/good-delete-dialog.component';
import { GoodRoutingModule } from './route/good-routing.module';

@NgModule({
  imports: [SharedModule, GoodRoutingModule],
  declarations: [GoodComponent, GoodDetailComponent, GoodUpdateComponent, GoodDeleteDialogComponent],
})
export class GoodModule {}
