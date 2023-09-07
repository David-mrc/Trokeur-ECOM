import { IUser } from 'app/entities/user/user.model';
import { ITradeOffer } from 'app/entities/trade-offer/trade-offer.model';

export interface ITrockeurUser {
  id: number;
  address?: string | null;
  zipCode?: string | null;
  description?: string | null;
  profilePicturePath?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
  tradeOffers?: Pick<ITradeOffer, 'id'>[] | null;
}

export type NewTrockeurUser = Omit<ITrockeurUser, 'id'> & { id: null };
