import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApplicationConfigService } from "app/core/config/application-config.service";
import { TradeObject } from "app/interfaces/TradeObjectInterface";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})

export class productService {

  private resourceUrl = this.applicationConfigService.getEndpointFor('api/trade-objects');

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  getAllProducts(): Observable<TradeObject[]> {
    return this.http.get<TradeObject[]>(this.resourceUrl);
  }
}
