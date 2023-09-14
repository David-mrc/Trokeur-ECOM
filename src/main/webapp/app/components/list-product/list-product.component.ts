import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TradeObject } from 'app/interfaces/TradeObjectInterface';
import { productService } from '../product-service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgFor, NgIf } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ObjectCategories } from 'app/interfaces/ObjectCategoriesInterface';
import { categoryService } from '../category-service';
import { TradeObjectState } from 'app/entities/enumerations/trade-object-state.model';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'jhi-list-product',
  templateUrl: './list-product.component.html',
  standalone: true,
	imports: [NgbDropdownModule, NgFor, ProductCardComponent, NgIf, RouterModule],
  styleUrls: ['./list-product.component.scss']
})

export class ListProductComponent implements OnInit {
  tradeObjectList: TradeObject[] = [];
  categories: string[] = [];
  states: TradeObjectState[] = [TradeObjectState.Neuf, TradeObjectState.Bon, TradeObjectState.Moyen, TradeObjectState.Mauvais];
  selectedCategory: string | undefined;
  selectedState: TradeObjectState | undefined;
  selectedSearchInput: string | undefined;

  constructor(
    private _productService: productService,
    protected http: HttpClient,
    private _categoryService: categoryService,
    private route: ActivatedRoute){}


  ngOnInit(): void {
    this.fetchCategories();

    this.route.queryParams.subscribe((params) => {
      this.selectedSearchInput = params.searchInput;
      this.selectedCategory = params.categoryName;
      this.selectedState = params.state;
      this.filter(this.selectedCategory, this.selectedState, this.selectedSearchInput);
    })
  }

  filter(category?: string, state?: string, searchInput?: string): void {
    if (category === undefined && state === undefined && searchInput === undefined) {
      this.fetchProduct();
    } else {
      this._productService.getFilteredProducts(this.selectedCategory, this.selectedState, this.selectedSearchInput).subscribe((tradeObjects) => {
        this.tradeObjectList = tradeObjects;
      });
    }
  }

  fetchCategories(): void {
    this.categories = [];
    // Pour récupérer toutes les catégories
    this._categoryService.getAllCategories().subscribe((categories) => {
      categories.map((category: ObjectCategories) => {
        this.categories.push(category.name);
      })
    })
  }

  fetchProduct(): void {
    this.tradeObjectList = [];
    this._productService.getAllProducts().subscribe((tradeObjects) => {
      tradeObjects.map((tradeObject: TradeObject) => {
        this.tradeObjectList.push(tradeObject);
      })
    });
  }
}
