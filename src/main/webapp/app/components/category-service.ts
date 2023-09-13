import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApplicationConfigService } from "app/core/config/application-config.service";
import { ObjectCategories } from "app/interfaces/ObjectCategoriesInterface";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})

export class categoryService {

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  getAllCategories(): Observable<ObjectCategories[]> {
    return this.http.get<ObjectCategories[]>(this.applicationConfigService.getEndpointFor('api/object-categories'));
  }
}
