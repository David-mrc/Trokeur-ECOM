import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApplicationConfigService } from "app/core/config/application-config.service";
import { TradeObjectState } from "app/entities/enumerations/trade-object-state.model";
import { TradeObject } from "app/interfaces/TradeObjectInterface";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})

export class productService {

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  getAllProducts(): Observable<TradeObject[]> {
    return this.http.get<TradeObject[]>(this.applicationConfigService.getEndpointFor('api/trade-objects'));
  }

  getMyProducts(): Observable<TradeObject[]> {
    return this.http.get<TradeObject[]>(this.applicationConfigService.getEndpointFor('api/current-trockeur-user-trade-objects'));
  }

  getFilteredProductsByCategory(categoryId: number): Observable<TradeObject[]> {
    return this.http.get<TradeObject[]>(this.applicationConfigService.getEndpointFor('api/category-trade-objects/' + categoryId.toString()));
  }

  getFilteredProductsByState(state: TradeObjectState): Observable<TradeObject[]> {
    return this.http.get<TradeObject[]>(this.applicationConfigService.getEndpointFor('api/state-trade-objects/' + state.toString()));
  }
}
