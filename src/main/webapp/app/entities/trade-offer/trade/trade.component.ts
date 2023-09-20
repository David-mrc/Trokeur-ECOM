import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TradeObjectService } from 'app/entities/trade-object/service/trade-object.service';
import { ITradeObject } from 'app/entities/trade-object/trade-object.model';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StateComponent } from 'app/components/state/state.component';
import { productService } from 'app/components/product-service';
import { ProductCardComponent } from 'app/components/product-card/product-card.component';
import { TradeOfferService } from '../service/trade-offer.service';

import { S3serviceService } from 'app/fileservice/s3service.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, map } from 'rxjs';
import { GenericImage } from 'app/interfaces/GenericImageInterface';

@Component({
  selector: 'jhi-trade',
  templateUrl: './trade.component.html',
  standalone: true,
  imports: [StateComponent, NgIf, NgFor, FontAwesomeModule, RouterLink, NgbModule, ProductCardComponent, CommonModule],
  styleUrls: ['./trade.component.scss'],
})
export class TradeComponent implements OnInit {
  askedProduct: ITradeObject | null | undefined;
  myTradeObjects: ITradeObject[] | undefined;
  selectedTradeObject: ITradeObject | undefined;
  objectImageUrl: Observable<SafeUrl> | undefined;
  myObjectsUrlArray: Observable<SafeUrl>[] = [];
  private modalRef!: NgbModalRef;

  constructor(
    private route: ActivatedRoute,
    private tradeObjectService: TradeObjectService,
    public modalService: NgbModal,
    private _productService: productService,
    private _tradeOfferService: TradeOfferService,
    private router: Router,
    private config: S3serviceService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.tradeObjectService.find(params.askedProductId).subscribe(tradeObject => {
        this.askedProduct = tradeObject.body;
        if (this.askedProduct) {
          this.objectImageUrl = this.getPathToFirstImage(this.askedProduct);
        }
      });
    });
    this._productService.getMyTradeObjectsAvailable().subscribe(myTradeObject => {
      this.myTradeObjects = myTradeObject;
      if (this.myTradeObjects) {
        let i = 0;
        for (const obj of this.myTradeObjects) {
          this.myObjectsUrlArray[i] = this.getPathToFirstImage(obj);
          i = +1;
        }
      }
    });
  }

  getPathToFirstImage(obj: ITradeObject): Observable<SafeUrl> {
    let url: string;
    const img = obj.genericImages?.values().next().value;
    if (img) {
      url = img.imagePath;
    } else {
      url = 'default.png';
    }
    return this.config.getImage(url).pipe(
      map((blob: any) => {
        const objectURL = URL.createObjectURL(blob);
        return this.sanitizer.bypassSecurityTrustUrl(objectURL);
      })
    );
  }

  openCarousel(content: any): void {
    this.modalRef = this.modalService.open(content, { centered: true });
  }

  closeModal(): void {
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
    this._tradeOfferService
      .createTradeOffer(this.askedProduct?.id ? this.askedProduct.id : 0, this.selectedTradeObject?.id ? this.selectedTradeObject.id : 0)
      .subscribe(() => {});
    this.router.navigate(['/trade-done'], {});
  }
}
