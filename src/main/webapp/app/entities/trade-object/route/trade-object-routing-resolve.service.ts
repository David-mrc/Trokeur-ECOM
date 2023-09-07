import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITradeObject } from '../trade-object.model';
import { TradeObjectService } from '../service/trade-object.service';

export const tradeObjectResolve = (route: ActivatedRouteSnapshot): Observable<null | ITradeObject> => {
  const id = route.params['id'];
  if (id) {
    return inject(TradeObjectService)
      .find(id)
      .pipe(
        mergeMap((tradeObject: HttpResponse<ITradeObject>) => {
          if (tradeObject.body) {
            return of(tradeObject.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default tradeObjectResolve;
