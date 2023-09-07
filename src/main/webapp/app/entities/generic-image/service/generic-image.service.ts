import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGenericImage, NewGenericImage } from '../generic-image.model';

export type PartialUpdateGenericImage = Partial<IGenericImage> & Pick<IGenericImage, 'id'>;

export type EntityResponseType = HttpResponse<IGenericImage>;
export type EntityArrayResponseType = HttpResponse<IGenericImage[]>;

@Injectable({ providedIn: 'root' })
export class GenericImageService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/generic-images');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(genericImage: NewGenericImage): Observable<EntityResponseType> {
    return this.http.post<IGenericImage>(this.resourceUrl, genericImage, { observe: 'response' });
  }

  update(genericImage: IGenericImage): Observable<EntityResponseType> {
    return this.http.put<IGenericImage>(`${this.resourceUrl}/${this.getGenericImageIdentifier(genericImage)}`, genericImage, {
      observe: 'response',
    });
  }

  partialUpdate(genericImage: PartialUpdateGenericImage): Observable<EntityResponseType> {
    return this.http.patch<IGenericImage>(`${this.resourceUrl}/${this.getGenericImageIdentifier(genericImage)}`, genericImage, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGenericImage>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGenericImage[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getGenericImageIdentifier(genericImage: Pick<IGenericImage, 'id'>): number {
    return genericImage.id;
  }

  compareGenericImage(o1: Pick<IGenericImage, 'id'> | null, o2: Pick<IGenericImage, 'id'> | null): boolean {
    return o1 && o2 ? this.getGenericImageIdentifier(o1) === this.getGenericImageIdentifier(o2) : o1 === o2;
  }

  addGenericImageToCollectionIfMissing<Type extends Pick<IGenericImage, 'id'>>(
    genericImageCollection: Type[],
    ...genericImagesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const genericImages: Type[] = genericImagesToCheck.filter(isPresent);
    if (genericImages.length > 0) {
      const genericImageCollectionIdentifiers = genericImageCollection.map(
        genericImageItem => this.getGenericImageIdentifier(genericImageItem)!
      );
      const genericImagesToAdd = genericImages.filter(genericImageItem => {
        const genericImageIdentifier = this.getGenericImageIdentifier(genericImageItem);
        if (genericImageCollectionIdentifiers.includes(genericImageIdentifier)) {
          return false;
        }
        genericImageCollectionIdentifiers.push(genericImageIdentifier);
        return true;
      });
      return [...genericImagesToAdd, ...genericImageCollection];
    }
    return genericImageCollection;
  }
}
