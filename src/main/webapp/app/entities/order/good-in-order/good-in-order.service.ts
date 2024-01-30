import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOrder, NewOrder } from '../order.model';
import { ASC, DESC } from '../../../config/navigation.constants';
import { IGoodInOrder } from './good-in-order.model';
import { IGood } from '../../good/good.model';
import { ActionWithGood, ChangedGoods } from '../update/order-form.service';

export type PartialUpdateOrder = Partial<IGoodInOrder> & Pick<IGoodInOrder, 'good_in_order_id'>;

type RestOf<T extends IGoodInOrder | NewOrder> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestOrder = RestOf<IGoodInOrder>;

export type EntityResponseType = HttpResponse<IGoodInOrder>;
export type EntityArrayResponseType = HttpResponse<IGoodInOrder[]>;

@Injectable({ providedIn: 'root' })
export class GoodInOrderService {
  predicate = 'id';
  ascending = true;

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/goodInOrder');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(goodInOrder: IGoodInOrder, orderId: string): Observable<EntityResponseType> {
    return this.http
      .post<RestOrder>(`${this.resourceUrl}/${orderId}`, goodInOrder, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(goodInOrder: IGoodInOrder, orderId: string): Observable<EntityResponseType> {
    return this.http
      .put<RestOrder>(
        `${this.resourceUrl}/${goodInOrder.good_in_order_id}/
      ${orderId}`,
        goodInOrder,
        { observe: 'response' }
      )
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  applyChanges(changedGoods: ChangedGoods[], orderId: string): Observable<HttpResponse<{}>[]> {
    return combineLatest(
      changedGoods.map(changedGood => {
        switch (changedGood.action) {
          case ActionWithGood.ADD:
            return this.create(changedGood.goodInOrder, orderId);

          case ActionWithGood.CHANGE:
            return this.update(changedGood.goodInOrder, orderId);

          case ActionWithGood.DELETE:
            return this.delete(changedGood.goodInOrder.good_in_order_id);
        }
      })
    );
    /*return forkJoin(changedGoods.map(changedGood => {
      switch (changedGood.action) {
        case ActionWithGood.ADD:
          return this.create(changedGood.goodInOrder, orderId)

        case ActionWithGood.CHANGE:
          return this.update(changedGood.goodInOrder)

        case ActionWithGood.DELETE:
          return this.delete(changedGood.goodInOrder.good_in_order_id)
      }
    }))*/
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestOrder[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  getByOrderId(orderId: string): Observable<EntityArrayResponseType> {
    return this.http.get<IGoodInOrder[]>(`${this.resourceUrl}/${orderId}`, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertResponseFromServer(res: HttpResponse<RestOrder>): HttpResponse<IGoodInOrder> {
    return res.clone({
      body: res.body ?? null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestOrder[]>): HttpResponse<IGoodInOrder[]> {
    return res.clone({
      body: res.body ?? null,
    });
  }

  getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
}
