import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { forkJoin, Observable, combineLatest, take } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ASC, DESC } from '../../../config/navigation.constants';
import { IGood } from '../../good/good.model';
import { IGoodInOrder, NewGoodInOrder } from '../good-in-order/good-in-order.model';
import { ActionWithGood, ChangedGoods } from '../update/order-form.service';

export type PartialUpdateOrder = Partial<IGoodInOrder> & Pick<IGoodInOrder, 'good_in_order_id'>;

type RestOf<T extends IGoodInOrder | NewGoodInOrder> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestOrder = RestOf<IGoodInOrder>;

export type EntityResponseType = HttpResponse<IGoodInOrder>;
export type EntityArrayResponseType = HttpResponse<IGoodInOrder[]>;

@Injectable({ providedIn: 'root' })
export class AddGoodInOrderService {
  predicate = 'id';
  ascending = true;

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/goodInOrder');
  protected goodResourceUrl = this.applicationConfigService.getEndpointFor('api/goods');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(goodInOrder: IGoodInOrder, orderId: string): Observable<EntityResponseType> {
    return this.http
      .post<RestOrder>(`this.resourceUrl/new/${orderId}`, goodInOrder, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(order: IGoodInOrder): Observable<EntityResponseType> {
    const copy = order.good_in_order_id;
    return this.http
      .put<RestOrder>(`${this.resourceUrl}/${order.good_in_order_id}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
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
    console.log('from delete');
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

  public getAll(): Observable<HttpResponse<IGood[]>> {
    return this.http.get<IGood[]>(`${this.goodResourceUrl}`, { observe: 'response' });
  }

  public addNewGoodToOrder(order: IGoodInOrder, fromParent: string): Observable<EntityResponseType> {
    return this.http
      .post<RestOrder>(`${this.resourceUrl}/new/${fromParent}`, order, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }
}
