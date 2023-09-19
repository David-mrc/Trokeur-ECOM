import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TradeObjectService } from 'app/entities/trade-object/service/trade-object.service';
import { ITradeObject } from 'app/entities/trade-object/trade-object.model';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgFor, NgIf } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StateComponent } from 'app/components/state/state.component';
import { productService } from 'app/components/product-service';
import { ProductCardComponent } from 'app/components/product-card/product-card.component';
import { TradeOfferService } from '../service/trade-offer.service';

@Component({
  selector: 'jhi-trade',
  templateUrl: './trade.component.html',
  standalone: true,
  imports: [StateComponent, NgIf, NgFor, FontAwesomeModule, RouterLink, NgbModule, ProductCardComponent],
  styleUrls: ['./trade.component.scss']
})
export class TradeComponent implements OnInit {

  askedProduct: ITradeObject | null | undefined;
  myTradeObjects: ITradeObject[] | undefined;
  selectedTradeObject: ITradeObject | undefined;
  private modalRef!: NgbModalRef;


  constructor(
    private route: ActivatedRoute,
    private tradeObjectService: TradeObjectService,
    public modalService: NgbModal,
    private _productService: productService,
    private _tradeOfferService: TradeOfferService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.tradeObjectService.find(params.askedProductId).subscribe((tradeObject) => {
        this.askedProduct = tradeObject.body;
      })
    })
    this._productService.getMyTradeObjects().subscribe((myTradeObject) => {
      this.myTradeObjects = myTradeObject;
    });
  }

  getPathToFirstImage(): string {
    return "/content/images/logoTrokeur.png";
  }

  openCarousel(content : any): void {
    this.modalRef = this.modalService.open(content, { centered: true });
  }

  closeModal() : void {
    this.modalRef.close('Cross click');
  }

  select(tradeObject: ITradeObject): void {
    if (tradeObject.id === this.selectedTradeObject?.id) {
      this.selectedTradeObject = undefined;
    } else {
      this.selectedTradeObject = tradeObject;
    }
  }

  createTradeOffer(): void {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this._tradeOfferService.createTradeOffer(this.askedProduct?.id ? this.askedProduct.id : 0, this.selectedTradeObject?.id ? this.selectedTradeObject.id : 0).subscribe(()=> {});
  }


}
