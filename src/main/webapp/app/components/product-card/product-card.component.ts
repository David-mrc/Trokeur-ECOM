import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TradeObject } from 'app/interfaces/TradeObjectInterface';
import { StateComponent } from '../state/state.component';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { S3serviceService } from 'app/fileservice/s3service.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, map } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'jhi-product-card',
  templateUrl: './product-card.component.html',
  standalone: true,
  imports: [StateComponent, NgIf, FontAwesomeModule, RouterLink, NgbModule, CommonModule],
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() tradeObject: TradeObject | undefined;
  @Input() isPublic = true;
  imageUrl: Observable<SafeUrl> | undefined;
  private modalRef!: NgbModalRef;

  constructor(public modalService: NgbModal, private config: S3serviceService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    // eslint-disable-next-line no-console
    console.log(this.tradeObject?.trockeurUser?.user);
    this.imageUrl = this.getPathToFirstImage();
  }

  getPathToFirstImage(): Observable<SafeUrl> {
    return this.config.getImage('1694778502441-img1.jpg').pipe(
      map((blob: any) => {
        const objectURL = URL.createObjectURL(blob);
        return this.sanitizer.bypassSecurityTrustUrl(objectURL);
      })
    );
  }

  //   if (this.tradeObject?.genericImages?.[0]) {
  //     return this.tradeObject.genericImages[0].imagePath;
  //   } else {
  //     return "/content/images/logoTrokeur.png";
  //   }
  // }

  openCarousel(content: any): void {
    this.modalRef = this.modalService.open(content, { centered: true });
  }

  closeModal(): void {
    this.modalRef.close('Cross click');
  }
}
