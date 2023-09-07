import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGenericImage } from '../generic-image.model';
import { GenericImageService } from '../service/generic-image.service';

export const genericImageResolve = (route: ActivatedRouteSnapshot): Observable<null | IGenericImage> => {
  const id = route.params['id'];
  if (id) {
    return inject(GenericImageService)
      .find(id)
      .pipe(
        mergeMap((genericImage: HttpResponse<IGenericImage>) => {
          if (genericImage.body) {
            return of(genericImage.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        })
      );
  }
  return of(null);
};

export default genericImageResolve;
