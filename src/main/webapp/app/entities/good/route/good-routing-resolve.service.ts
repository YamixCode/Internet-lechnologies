import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGood } from '../good.model';
import { GoodService } from '../service/good.service';

@Injectable({ providedIn: 'root' })
export class GoodRoutingResolveService implements Resolve<IGood | null> {
  constructor(protected service: GoodService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGood | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((good: HttpResponse<IGood>) => {
          if (good.body) {
            return of(good.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
