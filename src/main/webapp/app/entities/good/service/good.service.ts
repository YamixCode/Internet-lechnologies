import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGood, NewGood } from '../good.model';

export type PartialUpdateGood = Partial<IGood> & Pick<IGood, 'id'>;

export type EntityResponseType = HttpResponse<IGood>;
export type EntityArrayResponseType = HttpResponse<IGood[]>;

@Injectable({ providedIn: 'root' })
export class GoodService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/goods');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(good: NewGood): Observable<EntityResponseType> {
    return this.http.post<IGood>(this.resourceUrl, good, { observe: 'response' });
  }

  update(good: IGood): Observable<EntityResponseType> {
    return this.http.put<IGood>(`${this.resourceUrl}/${this.getGoodIdentifier(good)}`, good, { observe: 'response' });
  }

  updateAmountByGoodId(goodId: string, amount: number): Observable<EntityResponseType> {
    return this.http.put<IGood>(`${this.resourceUrl}/amount/${goodId}`, { amount: amount }, { observe: 'response' });
  }

  partialUpdate(good: PartialUpdateGood): Observable<EntityResponseType> {
    return this.http.patch<IGood>(`${this.resourceUrl}/${this.getGoodIdentifier(good)}`, good, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGood>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGood[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getGoodIdentifier(good: Pick<IGood, 'id'>): string {
    return good.id;
  }

  compareGood(o1: Pick<IGood, 'id'> | null, o2: Pick<IGood, 'id'> | null): boolean {
    return o1 && o2 ? this.getGoodIdentifier(o1) === this.getGoodIdentifier(o2) : o1 === o2;
  }

  addGoodToCollectionIfMissing<Type extends Pick<IGood, 'id'>>(
    goodCollection: Type[],
    ...goodsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const goods: Type[] = goodsToCheck.filter(isPresent);
    if (goods.length > 0) {
      const goodCollectionIdentifiers = goodCollection.map(goodItem => this.getGoodIdentifier(goodItem)!);
      const goodsToAdd = goods.filter(goodItem => {
        const goodIdentifier = this.getGoodIdentifier(goodItem);
        if (goodCollectionIdentifiers.includes(goodIdentifier)) {
          return false;
        }
        goodCollectionIdentifiers.push(goodIdentifier);
        return true;
      });
      return [...goodsToAdd, ...goodCollection];
    }
    return goodCollection;
  }
}
