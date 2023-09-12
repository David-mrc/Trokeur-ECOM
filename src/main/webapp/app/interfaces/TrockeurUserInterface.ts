import { TradeObject } from "./TradeObjectInterface";
import { TradeOffer } from "./TradeOfferInterface";
import { User } from "./UserInterface";

export interface TrockeurUser {
  id: number;
  address: string;
  zipCode: string;
  description: string;
  profilePicturePath: string;
  user: User; // Assuming User is another interface or type
  tradeObjects: null | TradeObject[]; // Assuming TradeObject is another interface or type
  tradeOffers: null | TradeOffer[]; // Assuming TradeOffer is another interface or type
}
