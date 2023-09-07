import dayjs from 'dayjs/esm';

import { TradeOfferState } from 'app/entities/enumerations/trade-offer-state.model';

import { ITradeOffer, NewTradeOffer } from './trade-offer.model';

export const sampleWithRequiredData: ITradeOffer = {
  id: 21917,
  date: dayjs('2023-09-06'),
  state: 'FINALISE',
};

export const sampleWithPartialData: ITradeOffer = {
  id: 21760,
  date: dayjs('2023-09-07'),
  state: 'EN_COURS',
};

export const sampleWithFullData: ITradeOffer = {
  id: 24614,
  date: dayjs('2023-09-07'),
  state: 'REFUSE',
};

export const sampleWithNewData: NewTradeOffer = {
  date: dayjs('2023-09-07'),
  state: 'REFUSE',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
