import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IOrder } from '../order.model';
import { OrderService } from '../service/order.service';
import { IGood } from '../../good/good.model';
import { GoodService } from '../../good/service/good.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddGoodInOrderService } from './add-good-to-order.service';
import { IGoodInOrder } from '../good-in-order/good-in-order.model';

@Component({
  selector: 'jhi-order-detail',
  templateUrl: './add-good-to-order.component.html',
})
export class AddGoodToOder implements OnInit {
  @Input() fromParent: IGoodInOrder[] = [];

  order: IOrder | null = null;
  good: IGood | null = null;

  predicate = 'id';
  ascending = true;

  isLoading = true;
  isAddingInProgress = false;

  goods: IGood[] = [];

  goodsInOrder: IGoodInOrder[] = [];

  selectedGoodId: string = '';
  selectedGood: IGood | null = null;
  hoveredGoodId: string = '';
  anyElementSelected = false;

  constructor(
    protected activeModal: NgbActiveModal,
    protected orderService: OrderService,
    protected goodService: GoodService,
    protected goodInOrderService: AddGoodInOrderService
  ) {}

  trackId = (_index: number, item: IGood): string => this.goodService.getGoodIdentifier(item);

  ngOnInit(): void {
    this.isLoading = true;
    this.loadAll();
    //console.log("from parent: " + this.fromParent.orderId)
  }

  loadAll(): void {
    console.log(this.goodsInOrder);
    this.goodInOrderService.getAll().subscribe(goods => {
      this.goods = this.filterGoods(goods.body);
      this.isLoading = false;
    });
  }

  filterGoods(goodsFromDb: IGood[] | null): IGood[] {
    let goods: IGood[] = [];
    goodsFromDb?.map(goodFromDb => {
      if (!this.fromParent.find(goodFromParent => goodFromParent.good_id == goodFromDb.id)) goods.push(goodFromDb);
    });
    return goods;
  }

  setGoodSelected(good: IGood): void {
    if (this.selectedGoodId != good.id) {
      this.selectedGoodId = good.id;
      this.anyElementSelected = true;
      this.selectedGood = good;
    } else {
      this.anyElementSelected = false;
      this.selectedGoodId = '';
      this.selectedGood = null;
    }
  }

  onGoodAdded(): void {
    if (this.selectedGood != null) {
      this.activeModal.close(this.selectedGood);
    }
  }

  setGoodHovered(good: IGood): void {
    this.hoveredGoodId = good.id;
  }

  getTrBackgroundColor(good: IGood): any {
    /*if (this.anyElementSelected) {
      if (this.selectedGoodId == good.id) {
        return {'background-color': this.isCurrentHovered(good) ? 'lightblue' : ''}
      }
      //else return {'': ''}
    }*/

    if (good.id == this.selectedGoodId) return { 'background-color': 'lightblue' };

    if (!this.anyElementSelected && good.id == this.hoveredGoodId) {
      return { 'background-color': 'lightgray' };
    }
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  previousState(): void {
    window.history.back();
  }
}
