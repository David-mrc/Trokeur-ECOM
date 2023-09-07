import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IObjectCategory, NewObjectCategory } from '../object-category.model';

export type PartialUpdateObjectCategory = Partial<IObjectCategory> & Pick<IObjectCategory, 'id'>;

export type EntityResponseType = HttpResponse<IObjectCategory>;
export type EntityArrayResponseType = HttpResponse<IObjectCategory[]>;

@Injectable({ providedIn: 'root' })
export class ObjectCategoryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/object-categories');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(objectCategory: NewObjectCategory): Observable<EntityResponseType> {
    return this.http.post<IObjectCategory>(this.resourceUrl, objectCategory, { observe: 'response' });
  }

  update(objectCategory: IObjectCategory): Observable<EntityResponseType> {
    return this.http.put<IObjectCategory>(`${this.resourceUrl}/${this.getObjectCategoryIdentifier(objectCategory)}`, objectCategory, {
      observe: 'response',
    });
  }

  partialUpdate(objectCategory: PartialUpdateObjectCategory): Observable<EntityResponseType> {
    return this.http.patch<IObjectCategory>(`${this.resourceUrl}/${this.getObjectCategoryIdentifier(objectCategory)}`, objectCategory, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IObjectCategory>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IObjectCategory[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getObjectCategoryIdentifier(objectCategory: Pick<IObjectCategory, 'id'>): number {
    return objectCategory.id;
  }

  compareObjectCategory(o1: Pick<IObjectCategory, 'id'> | null, o2: Pick<IObjectCategory, 'id'> | null): boolean {
    return o1 && o2 ? this.getObjectCategoryIdentifier(o1) === this.getObjectCategoryIdentifier(o2) : o1 === o2;
  }

  addObjectCategoryToCollectionIfMissing<Type extends Pick<IObjectCategory, 'id'>>(
    objectCategoryCollection: Type[],
    ...objectCategoriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const objectCategories: Type[] = objectCategoriesToCheck.filter(isPresent);
    if (objectCategories.length > 0) {
      const objectCategoryCollectionIdentifiers = objectCategoryCollection.map(
        objectCategoryItem => this.getObjectCategoryIdentifier(objectCategoryItem)!
      );
      const objectCategoriesToAdd = objectCategories.filter(objectCategoryItem => {
        const objectCategoryIdentifier = this.getObjectCategoryIdentifier(objectCategoryItem);
        if (objectCategoryCollectionIdentifiers.includes(objectCategoryIdentifier)) {
          return false;
        }
        objectCategoryCollectionIdentifiers.push(objectCategoryIdentifier);
        return true;
      });
      return [...objectCategoriesToAdd, ...objectCategoryCollection];
    }
    return objectCategoryCollection;
  }
}
