import { ITradeObject } from 'app/entities/trade-object/trade-object.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITradeOffer, NewTradeOffer } from '../trade-offer.model';

export type PartialUpdateTradeOffer = Partial<ITradeOffer> & Pick<ITradeOffer, 'id'>;

type RestOf<T extends ITradeOffer | NewTradeOffer> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestTradeOffer = RestOf<ITradeOffer>;

export type NewRestTradeOffer = RestOf<NewTradeOffer>;

export type PartialUpdateRestTradeOffer = RestOf<PartialUpdateTradeOffer>;

export type EntityResponseType = HttpResponse<ITradeOffer>;
export type EntityArrayResponseType = HttpResponse<ITradeOffer[]>;

@Injectable({ providedIn: 'root' })
export class TradeOfferService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/trade-offers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(tradeOffer: NewTradeOffer): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tradeOffer);
    return this.http
      .post<RestTradeOffer>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(tradeOffer: ITradeOffer): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tradeOffer);
    return this.http
      .put<RestTradeOffer>(`${this.resourceUrl}/${this.getTradeOfferIdentifier(tradeOffer)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(tradeOffer: PartialUpdateTradeOffer): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tradeOffer);
    return this.http
      .patch<RestTradeOffer>(`${this.resourceUrl}/${this.getTradeOfferIdentifier(tradeOffer)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestTradeOffer>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestTradeOffer[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTradeOfferIdentifier(tradeOffer: Pick<ITradeOffer, 'id'>): number {
    return tradeOffer.id;
  }

  compareTradeOffer(o1: Pick<ITradeOffer, 'id'> | null, o2: Pick<ITradeOffer, 'id'> | null): boolean {
    return o1 && o2 ? this.getTradeOfferIdentifier(o1) === this.getTradeOfferIdentifier(o2) : o1 === o2;
  }

  addTradeOfferToCollectionIfMissing<Type extends Pick<ITradeOffer, 'id'>>(
    tradeOfferCollection: Type[],
    ...tradeOffersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const tradeOffers: Type[] = tradeOffersToCheck.filter(isPresent);
    if (tradeOffers.length > 0) {
      const tradeOfferCollectionIdentifiers = tradeOfferCollection.map(tradeOfferItem => this.getTradeOfferIdentifier(tradeOfferItem)!);
      const tradeOffersToAdd = tradeOffers.filter(tradeOfferItem => {
        const tradeOfferIdentifier = this.getTradeOfferIdentifier(tradeOfferItem);
        if (tradeOfferCollectionIdentifiers.includes(tradeOfferIdentifier)) {
          return false;
        }
        tradeOfferCollectionIdentifiers.push(tradeOfferIdentifier);
        return true;
      });
      return [...tradeOffersToAdd, ...tradeOfferCollection];
    }
    return tradeOfferCollection;
  }

  getProposedTradeObject(id: number): Observable<ITradeObject> {
    return this.http.get<ITradeObject>(`${this.applicationConfigService.getEndpointFor('api/trade-offer-proposed-object')}/${id}`);
  }

  getWantedTradeObject(id: number): Observable<ITradeObject> {
    return this.http.get<ITradeObject>(`${this.applicationConfigService.getEndpointFor('api/trade-offer-wanted-object')}/${id}`);
  }

  getAllOffersOfUser(): Observable<ITradeOffer[]> {
    return this.http.get<ITradeOffer[]>(this.applicationConfigService.getEndpointFor('api/current-trockeur-user-trade-offers'));
  }

  getAllNonPendingOffersOfUser(): Observable<ITradeOffer[]> {
    return this.http.get<ITradeOffer[]>(this.applicationConfigService.getEndpointFor('api/trade-offer/non-pending-of-user'));
  }

  getAllPendingOffersFromUser(): Observable<ITradeOffer[]> {
    return this.http.get<ITradeOffer[]>(this.applicationConfigService.getEndpointFor('api/trade-offer/pending-offered-by-user'));
  }

  getAllPendingOffersToUser(): Observable<ITradeOffer[]> {
    return this.http.get<ITradeOffer[]>(this.applicationConfigService.getEndpointFor('api/trade-offer/pending-received-by-user'));
  }

  cancelTradeOffer(id: number | undefined): Observable<{}> {
    return this.http.delete(this.applicationConfigService.getEndpointFor('api/trade-offers/cancel/' + id));
  }

  refuseTradeOffer(id: number | undefined): Observable<{}> {
    return this.http.put(this.applicationConfigService.getEndpointFor('api/trade-offers/refuse/' + id), id);
  }

  acceptTradeOffer(id: number | undefined): Observable<boolean | undefined> {
    return this.http.put<boolean>(this.applicationConfigService.getEndpointFor('api/trade-offers/accept/' + id), id);

  createTradeOffer(askedProductId: number, selectedProductId: number): Observable<{}> {
    return this.http.get(this.applicationConfigService.getEndpointFor('api/trade-offers/trade'),
    {params: new HttpParams()
      .set("askedProductId", askedProductId)
      .set("selectedProductId", selectedProductId)});
  }

  protected convertDateFromClient<T extends ITradeOffer | NewTradeOffer | PartialUpdateTradeOffer>(tradeOffer: T): RestOf<T> {
    return {
      ...tradeOffer,
      date: tradeOffer.date?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restTradeOffer: RestTradeOffer): ITradeOffer {
    return {
      ...restTradeOffer,
      date: restTradeOffer.date ? dayjs(restTradeOffer.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestTradeOffer>): HttpResponse<ITradeOffer> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestTradeOffer[]>): HttpResponse<ITradeOffer[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
