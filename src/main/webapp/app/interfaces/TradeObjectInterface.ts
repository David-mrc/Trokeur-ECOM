import { GenericImage } from "./GenericImageInterface";
import { ObjectCategories } from "./ObjectCategoriesInterface";
import { TradeOffer } from "./TradeOfferInterface";
import { TrockeurUser } from "./TrockeurUserInterface";

export interface TradeObject {
  id: number;
  name: string;
  description: string;
  state: string;
  stock: number;
  genericImages: null | GenericImage[];
  objectCategories: null | ObjectCategories[];
  trockeurUser: null | TrockeurUser;
  tradeOffers: null | TradeOffer[];
}
