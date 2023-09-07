import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITrockeurUser } from '../trockeur-user.model';
import { TrockeurUserService } from '../service/trockeur-user.service';

export const trockeurUserResolve = (route: ActivatedRouteSnapshot): Observable<null | ITrockeurUser> => {
  const id = route.params['id'];
  if (id) {
    return inject(TrockeurUserService)
      .find(id)
      .pipe(
        mergeMap((trockeurUser: HttpResponse<ITrockeurUser>) => {
          if (trockeurUser.body) {
            return of(trockeurUser.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default trockeurUserResolve;
