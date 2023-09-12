import { TradeObject } from "./TradeObjectInterface";
import { TrockeurUser } from "./TrockeurUserInterface";

export interface TradeOffer {
  id: number;
  date: string;
  state: string;
  tradeObjects: null | TradeObject[];
  trockeurUsers: null | TrockeurUser[];
}
