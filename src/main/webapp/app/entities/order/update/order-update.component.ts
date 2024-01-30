import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ActionWithGood, ChangedGoods, OrderFormGroup, OrderFormService } from './order-form.service';
import { IOrder } from '../order.model';
import { OrderService } from '../service/order.service';
import { IGood } from '../../good/good.model';
import { GoodInOrderService } from '../good-in-order/good-in-order.service';
import { IGoodInOrder } from '../good-in-order/good-in-order.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddGoodToOder } from '../addGoodsToOrderModal/add-good-to-order.component';
import { AddGoodInOrderService } from '../addGoodsToOrderModal/add-good-to-order.service';

@Component({
  selector: 'jhi-order-update',
  templateUrl: './order-update.component.html',
})
export class OrderUpdateComponent implements OnInit {
  isSaving = false;
  order: IOrder | null = null;
  goodsInOrder: IGoodInOrder[] = [];

  isLoading = false;

  changedGoods: ChangedGoods[] = [];

  deletedGoods: IGoodInOrder[] = [];

  editForm: OrderFormGroup = this.orderFormService.createOrderFormGroup();

  predicate = 'id';
  ascending = true;

  constructor(
    protected orderService: OrderService,
    protected orderFormService: OrderFormService,
    protected activatedRoute: ActivatedRoute,
    protected goodInOrderService: GoodInOrderService,
    protected modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.activatedRoute.data.subscribe(({ order }) => {
      this.order = order;
      if (order) {
        this.updateForm(order);
        this.goodInOrderService.getByOrderId(order.id).subscribe(goods => {
          this.goodsInOrder = goods.body ?? [];
          this.isLoading = false;
          console.log(this.goodsInOrder);
        });
      }
    });
  }

  previousState(): void {
    window.history.back();
    console.log('called back!');
  }

  incrementAmount(goodInOrderId: number): void {
    this.goodsInOrder.map(goodInOrder => {
      if (goodInOrder.good_in_order_id == goodInOrderId) {
        if (goodInOrder.good_in_order_amount) {
          goodInOrder.good_in_order_amount++;
          this.addGoodToChangedList(goodInOrder);
        }
      }
    });
  }

  decrementAmount(goodInOrderId: number): void {
    this.goodsInOrder.map(goodInOrder => {
      if (goodInOrder.good_in_order_id == goodInOrderId) {
        if (goodInOrder.good_in_order_amount) {
          if (goodInOrder.good_in_order_amount > 1) {
            goodInOrder.good_in_order_amount--;
            this.addGoodToChangedList(goodInOrder);
          }
        }
      }
    });
  }

  addGoodToChangedList(goodInOrder: IGoodInOrder): void {
    this.changedGoods.push({ goodInOrder: goodInOrder, action: ActionWithGood.CHANGE });
  }

  addGoodToOrder(order: IOrder | null): void {
    if (order != null) {
      const activeModal = this.modalService.open(AddGoodToOder, {
        size: 'lg',
        backdrop: 'static',
      });

      activeModal.componentInstance.fromParent = this.goodsInOrder;
      activeModal.result.finally(() => {});
      activeModal.result.then(
        (good: IGood) => {
          this.changedGoods.push({ goodInOrder: this.createGoodInOrderFromGood(good), action: ActionWithGood.ADD });
          console.log('added good with id ' + good.id);
          this.goodsInOrder.push({
            good_amount: 1,
            good_in_order_id: 1,
            good_id: good.id,
            good_in_order_amount: 1,
            good_name: good.name,
          });
        },
        () => {}
      );
    }
  }

  createGoodInOrderFromGood(good: IGood): IGoodInOrder {
    return {
      good_amount: good.amount ?? 0,
      good_id: good.id,
      good_in_order_amount: 1,
      good_in_order_id: 0,
      good_name: good.name,
    };
  }

  save(): void {
    this.isSaving = true;
    const order = this.orderFormService.getOrder(this.editForm);
    if (order.id !== null) {
      this.subscribeToSaveResponse(this.orderService.update(order));

      if (this.changedGoods.length == 0) this.onSaveFinalize();
      else {
        this.goodInOrderService.applyChanges(this.changedGoods, order.id).subscribe(res => {});
      }
    } else {
      this.subscribeToSaveResponse(this.orderService.create(order));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrder>>): void {
    console.log('called subscribeToSaveResponse');
    result.pipe(finalize(() => {})).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  public openInNewTab(good_id: string | null): void {
    if (good_id) window.open(`/good/${good_id}/view`, '_blank');
  }

  markGoodDeleted(goodInOrder: IGoodInOrder) {
    this.changedGoods.push({ goodInOrder: goodInOrder, action: ActionWithGood.DELETE });
    this.deletedGoods.push(goodInOrder);
  }

  isGoodDeleted(goodInOrderId: string | null): boolean {
    return !!this.deletedGoods.find(good => good.good_id == goodInOrderId);
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(order: IOrder): void {
    this.order = order;
    this.orderFormService.resetForm(this.editForm, order);
  }
}
