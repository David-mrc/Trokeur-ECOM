import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITradeOffer } from '../trade-offer.model';
import { TradeOfferService } from '../service/trade-offer.service';

export const tradeOfferResolve = (route: ActivatedRouteSnapshot): Observable<null | ITradeOffer> => {
  const id = route.params['id'];
  if (id) {
    return inject(TradeOfferService)
      .find(id)
      .pipe(
        mergeMap((tradeOffer: HttpResponse<ITradeOffer>) => {
          if (tradeOffer.body) {
            return of(tradeOffer.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default tradeOfferResolve;
