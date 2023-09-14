import { HttpClient } from '@angular/common/http';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TradeObject } from 'app/interfaces/TradeObjectInterface';
import { productService } from '../product-service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgFor, NgIf } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ObjectCategories } from 'app/interfaces/ObjectCategoriesInterface';
import { categoryService } from '../category-service';
import { TradeObjectState } from 'app/entities/enumerations/trade-object-state.model';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'jhi-list-product',
  templateUrl: './list-product.component.html',
  standalone: true,
	imports: [NgbDropdownModule, NgFor, ProductCardComponent, NgIf],
  styleUrls: ['./list-product.component.scss']
})

export class ListProductComponent implements OnInit, OnChanges {
  tradeObjectList: TradeObject[] = [];
  categories: ObjectCategories[] = [];
  states: TradeObjectState[] = [TradeObjectState.Neuf, TradeObjectState.Bon, TradeObjectState.Moyen, TradeObjectState.Mauvais];
  selectedCategory: ObjectCategories | undefined;
  selectedState: TradeObjectState | undefined;
  selectedSearchInput: string | undefined;

  constructor(
    private _productService: productService,
    protected http: HttpClient,
    private _categoryService: categoryService,
    private route: ActivatedRoute){}


  ngOnInit(): void {
    this.fetchProduct();
    this.fetchCategories();
    this.route.queryParams.subscribe((params) => {
      this.selectedSearchInput = params.searchInput;
    })
    console.log("bien joué : ", this.selectedSearchInput);
  }

  filter(category?: ObjectCategories, state?: TradeObjectState, searchInput?: string): void {
    this.selectedCategory = category ? (category === this.selectedCategory ? undefined : category) : this.selectedCategory;
    this.selectedState = state ? (state === this.selectedState ? undefined : state) : this.selectedState;
    this.selectedSearchInput = searchInput ? searchInput : this.selectedSearchInput;



    this.tradeObjectList = [];
    // regarder si deja selectionné pr category & state
    this._productService.getFilteredProducts(this.selectedCategory?.id, this.selectedState?.toString(), this.selectedSearchInput).subscribe((tradeObjects) => {
      tradeObjects.map((tradeObject: TradeObject) => {
        this.tradeObjectList.push(tradeObject);
      })
    });
  }



  /* filterByCategory(category: ObjectCategories): void {
    // if user select the selected category, it unselect et display everything
    if (this.selectedCategory && category.id === this.selectedCategory.id) {
      this.fetchProduct();
      this.selectedCategory = undefined;
    } else {
      this.selectedCategory = category;
      this.tradeObjectList = [];
      this._productService.getFilteredProductsByCategory(this.selectedCategory.id).subscribe((tradeObjects) => {
        tradeObjects.map((tradeObject: TradeObject) => {
          this.tradeObjectList.push(tradeObject);
        })
      });
    }
  }

  filterByState(state: TradeObjectState): void {
    // if user select the selected state, it unselect et display everything
    if (this.selectedState === state) {
      this.fetchProduct();
      this.selectedState = undefined;
    } else {
      this.tradeObjectList = [];
      this.selectedState = state;
      this._productService.getFilteredProductsByState(state).subscribe((tradeObjects) => {
        tradeObjects.map((tradeObject: TradeObject) => {
          this.tradeObjectList.push(tradeObject);
        })
      });
    }
  }
  */
  resetCategory(): void {
    this.selectedCategory = undefined;
    this.filter(this.selectedCategory, this.selectedState, this.selectedSearchInput);
  }

  resetState(): void {
    this.selectedState = undefined;
    this.filter(this.selectedCategory, this.selectedState, this.selectedSearchInput);
  }

  fetchCategories(): void {
    this.categories = [];
    // Pour récupérer toutes les catégories
    this._categoryService.getAllCategories().subscribe((categories) => {
      categories.map((category: ObjectCategories) => {
        this.categories.push(category);
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
