import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TradeObject } from 'app/interfaces/TradeObjectInterface';
import { StateComponent } from '../state/state.component';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'jhi-product-card',
  templateUrl: './product-card.component.html',
  standalone: true,
  imports: [StateComponent, NgIf, FontAwesomeModule, RouterLink, NgbModule],
  styleUrls: ['./product-card.component.scss']
})

export class ProductCardComponent {
  @Input() tradeObject: TradeObject | undefined;
  @Input() isPublic = true;
  private modalRef!: NgbModalRef;

  constructor(
    public modalService: NgbModal,
    private router: Router,
    ){
  }

  ngOnInit(): void {
    // eslint-disable-next-line no-console
    console.log(this.tradeObject?.trockeurUser?.user);
  }

  getPathToFirstImage(): string {
    if (this.tradeObject?.genericImages?.[0]) {
      return this.tradeObject.genericImages[0].imagePath;
    } else {
      return "/content/images/logoTrokeur.png";
    }
  }

  openCarousel(content : any): void {
    this.modalRef = this.modalService.open(content, { centered: true });
  }

  closeModal() : void {
    this.modalRef.close('Cross click');
  }

  trade(): void {
    this.router.navigate(['/trade'], {
      queryParams: {
        askedProductId: this.tradeObject?.id
      },
    });
  }
}
