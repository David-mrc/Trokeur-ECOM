import { IUser } from './../../user/user.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITrockeurUser, NewTrockeurUser } from '../trockeur-user.model';
import { User } from 'app/interfaces/UserInterface';

export type PartialUpdateTrockeurUser = Partial<ITrockeurUser> & Pick<ITrockeurUser, 'id'>;

export type EntityResponseType = HttpResponse<ITrockeurUser>;
export type EntityArrayResponseType = HttpResponse<ITrockeurUser[]>;

@Injectable({ providedIn: 'root' })
export class TrockeurUserService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/trockeur-users');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(trockeurUser: NewTrockeurUser): Observable<EntityResponseType> {
    return this.http.post<ITrockeurUser>(this.resourceUrl, trockeurUser, { observe: 'response' });
  }

  update(trockeurUser: ITrockeurUser): Observable<EntityResponseType> {
    return this.http.put<ITrockeurUser>(`${this.resourceUrl}/${this.getTrockeurUserIdentifier(trockeurUser)}`, trockeurUser, {
      observe: 'response',
    });
  }

  partialUpdate(trockeurUser: PartialUpdateTrockeurUser): Observable<EntityResponseType> {
    return this.http.patch<ITrockeurUser>(`${this.resourceUrl}/${this.getTrockeurUserIdentifier(trockeurUser)}`, trockeurUser, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITrockeurUser>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findUserOfTrockeurUserId(id: number): Observable<IUser> {
    return this.http.get<IUser>(this.applicationConfigService.getEndpointFor('api/user-of-trockeur-user-id/' + id.toString()));
  }

  findUserByLogin(login: string | undefined): Observable<User | undefined> {
    return this.http.get<User | undefined>(this.applicationConfigService.getEndpointFor('api/user-by-login/' + login));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITrockeurUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTrockeurUserIdentifier(trockeurUser: Pick<ITrockeurUser, 'id'>): number {
    return trockeurUser.id;
  }

  compareTrockeurUser(o1: Pick<ITrockeurUser, 'id'> | null, o2: Pick<ITrockeurUser, 'id'> | null): boolean {
    return o1 && o2 ? this.getTrockeurUserIdentifier(o1) === this.getTrockeurUserIdentifier(o2) : o1 === o2;
  }

  addTrockeurUserToCollectionIfMissing<Type extends Pick<ITrockeurUser, 'id'>>(
    trockeurUserCollection: Type[],
    ...trockeurUsersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const trockeurUsers: Type[] = trockeurUsersToCheck.filter(isPresent);
    if (trockeurUsers.length > 0) {
      const trockeurUserCollectionIdentifiers = trockeurUserCollection.map(
        trockeurUserItem => this.getTrockeurUserIdentifier(trockeurUserItem)!
      );
      const trockeurUsersToAdd = trockeurUsers.filter(trockeurUserItem => {
        const trockeurUserIdentifier = this.getTrockeurUserIdentifier(trockeurUserItem);
        if (trockeurUserCollectionIdentifiers.includes(trockeurUserIdentifier)) {
          return false;
        }
        trockeurUserCollectionIdentifiers.push(trockeurUserIdentifier);
        return true;
      });
      return [...trockeurUsersToAdd, ...trockeurUserCollection];
    }
    return trockeurUserCollection;
  }
}
