import dayjs from 'dayjs/esm';
import { ITradeObject } from 'app/entities/trade-object/trade-object.model';
import { ITrockeurUser } from 'app/entities/trockeur-user/trockeur-user.model';
import { TradeOfferState } from 'app/entities/enumerations/trade-offer-state.model';

export interface ITradeOffer {
  id: number;
  date?: dayjs.Dayjs | null;
  state?: keyof typeof TradeOfferState | null;
  ownerID?: number | null;
  tradeObjects?: Pick<ITradeObject, 'id'>[] | null;
  trockeurUsers?: Pick<ITrockeurUser, 'id'>[] | null;
}

export type NewTradeOffer = Omit<ITradeOffer, 'id'> & { id: null };
