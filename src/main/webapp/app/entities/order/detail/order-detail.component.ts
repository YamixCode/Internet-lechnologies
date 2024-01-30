import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IOrder } from '../order.model';
import { OrderService } from '../service/order.service';
import { IGood } from '../../good/good.model';
import { GoodService } from '../../good/service/good.service';
import { IGoodInOrder } from '../good-in-order/good-in-order.model';
import { GoodInOrderService } from '../good-in-order/good-in-order.service';

@Component({
  selector: 'jhi-order-detail',
  templateUrl: './order-detail.component.html',
})
export class OrderDetailComponent implements OnInit {
  order: IOrder | null = null;

  predicate = 'id';
  ascending = true;

  goods: IGood[] = [];
  goodsInOrder: IGoodInOrder[] = [];

  isLoading = false;
  isSaving = false;

  constructor(
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected orderService: OrderService,
    protected goodService: GoodService,
    protected goodInOrderService: GoodInOrderService
  ) {}

  trackId = (_index: number, item: IGood): string => this.goodService.getGoodIdentifier(item);

  ngOnInit(): void {
    this.isLoading = true;
    this.activatedRoute.data.subscribe(({ order }) => {
      this.order = order;
      if (order) {
        this.goodInOrderService.getByOrderId(order.id).subscribe(goods => {
          this.goodsInOrder = goods.body ?? [];
          this.isLoading = false;
          console.log(this.goodsInOrder);
        });
      }
    });
  }

  bringTomorrow(): void {
    this.isSaving = true;
    this.order = {
      date: this.order?.date?.add(1, 'day'),
      id: <string>this.order?.id,
      name: this.order?.name,
    };
    this.orderService.update(this.order).subscribe(() => (this.isSaving = false));
  }

  shipOrder(): void {
    this.isSaving = true;
    this.orderService.decrementGoodsCountOnShip(this.goodsInOrder).subscribe(() => {
      this.isSaving = false;
    });
    this.orderService.delete(<string>this.order?.id).subscribe(() => this.previousState());
  }

  delete(order: any): void {}

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  protected handleNavigation(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.orderService.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  previousState(): void {
    window.history.back();
  }
}
