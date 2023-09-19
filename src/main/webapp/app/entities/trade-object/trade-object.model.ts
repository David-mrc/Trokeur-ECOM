import { IObjectCategory } from 'app/entities/object-category/object-category.model';
import { ITrockeurUser } from 'app/entities/trockeur-user/trockeur-user.model';
import { ITradeOffer } from 'app/entities/trade-offer/trade-offer.model';
import { TradeObjectState } from 'app/entities/enumerations/trade-object-state.model';
import { GenericImage } from 'app/interfaces/GenericImageInterface';

export interface ITradeObject {
  id: number;
  name?: string | null;
  description?: string | null;
  state?: keyof typeof TradeObjectState | null;
  stock?: number | null;
  genericImages?: Set<GenericImage> | null;
  objectCategories?: Pick<IObjectCategory, 'id'>[] | null;
  trockeurUser?: Pick<ITrockeurUser, 'id' | 'address' | 'user'> | null;
  tradeOffers?: Pick<ITradeOffer, 'id'>[] | null;
}

export type NewTradeObject = Omit<ITradeObject, 'id'> & { id: null };