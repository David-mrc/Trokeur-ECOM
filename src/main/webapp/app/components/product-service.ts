import { HttpClient, HttpParams } from "@angular/common/http";
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

  getAllProductsFromPage(pageNumber: number): Observable<TradeObject[]> {
    return this.http.get<TradeObject[]>(this.applicationConfigService.getEndpointFor('api/trade-objects/page'),
    {params: new HttpParams()
    .set("pageNumber", pageNumber)});
  }

  getAllProducts(): Observable<TradeObject[]> {
    return this.http.get<TradeObject[]>(this.applicationConfigService.getEndpointFor('api/trade-objects'));
  }

  getMyProducts(): Observable<TradeObject[]> {
    return this.http.get<TradeObject[]>(this.applicationConfigService.getEndpointFor('api/current-trockeur-user-trade-objects'));
  }

  getFilteredProducts(categoryName?: string, state?: TradeObjectState, searchInput?: string, pageNumber?: number): Observable<TradeObject[]> {
    return this.http.get<TradeObject[]>(
      this.applicationConfigService.getEndpointFor('api/trade-objects/filter'),
      {params: new HttpParams()
        .set("categoryName", categoryName ? categoryName : "")
        .set("state", state ? state : "")
        .set("searchInput", searchInput ? searchInput : "")
        .set("pageNumber", pageNumber ? pageNumber : 0)});
  }

  countAllProduct(): Observable<number> {
    return this.http.get<number>(this.applicationConfigService.getEndpointFor('api/trade-objects/count'));
  }

  countAllProductFiltered(categoryName?: string, state?: TradeObjectState, searchInput?: string): Observable<number> {
    return this.http.get<number>(this.applicationConfigService.getEndpointFor('api/trade-objects/filter/count'),
    {params: new HttpParams()
      .set("categoryName", categoryName ? categoryName : "")
      .set("state", state ? state : "")
      .set("searchInput", searchInput ? searchInput : "")});
  }
}
