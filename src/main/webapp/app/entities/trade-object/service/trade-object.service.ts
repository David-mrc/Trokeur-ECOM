import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITradeObject, NewTradeObject } from '../trade-object.model';

export type PartialUpdateTradeObject = Partial<ITradeObject> & Pick<ITradeObject, 'id'>;

export type EntityResponseType = HttpResponse<ITradeObject>;
export type EntityArrayResponseType = HttpResponse<ITradeObject[]>;

@Injectable({ providedIn: 'root' })
export class TradeObjectService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/trade-objects');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(tradeObject: NewTradeObject): Observable<EntityResponseType> {
    return this.http.post<ITradeObject>(this.resourceUrl, tradeObject, { observe: 'response' });
  }

  update(tradeObject: ITradeObject): Observable<EntityResponseType> {
    return this.http.put<ITradeObject>(`${this.resourceUrl}/${this.getTradeObjectIdentifier(tradeObject)}`, tradeObject, {
      observe: 'response',
    });
  }

  partialUpdate(tradeObject: PartialUpdateTradeObject): Observable<EntityResponseType> {
    return this.http.patch<ITradeObject>(`${this.resourceUrl}/${this.getTradeObjectIdentifier(tradeObject)}`, tradeObject, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITradeObject>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITradeObject[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTradeObjectIdentifier(tradeObject: Pick<ITradeObject, 'id'>): number {
    return tradeObject.id;
  }

  compareTradeObject(o1: Pick<ITradeObject, 'id'> | null, o2: Pick<ITradeObject, 'id'> | null): boolean {
    return o1 && o2 ? this.getTradeObjectIdentifier(o1) === this.getTradeObjectIdentifier(o2) : o1 === o2;
  }

  addTradeObjectToCollectionIfMissing<Type extends Pick<ITradeObject, 'id'>>(
    tradeObjectCollection: Type[],
    ...tradeObjectsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const tradeObjects: Type[] = tradeObjectsToCheck.filter(isPresent);
    if (tradeObjects.length > 0) {
      const tradeObjectCollectionIdentifiers = tradeObjectCollection.map(
        tradeObjectItem => this.getTradeObjectIdentifier(tradeObjectItem)!
      );
      const tradeObjectsToAdd = tradeObjects.filter(tradeObjectItem => {
        const tradeObjectIdentifier = this.getTradeObjectIdentifier(tradeObjectItem);
        if (tradeObjectCollectionIdentifiers.includes(tradeObjectIdentifier)) {
          return false;
        }
        tradeObjectCollectionIdentifiers.push(tradeObjectIdentifier);
        return true;
      });
      return [...tradeObjectsToAdd, ...tradeObjectCollection];
    }
    return tradeObjectCollection;
  }
}
