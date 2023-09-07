import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IObjectCategory } from '../object-category.model';
import { ObjectCategoryService } from '../service/object-category.service';

export const objectCategoryResolve = (route: ActivatedRouteSnapshot): Observable<null | IObjectCategory> => {
  const id = route.params['id'];
  if (id) {
    return inject(ObjectCategoryService)
      .find(id)
      .pipe(
        mergeMap((objectCategory: HttpResponse<IObjectCategory>) => {
          if (objectCategory.body) {
            return of(objectCategory.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default objectCategoryResolve;
