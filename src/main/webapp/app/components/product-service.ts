import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApplicationConfigService } from "app/core/config/application-config.service";
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
}
