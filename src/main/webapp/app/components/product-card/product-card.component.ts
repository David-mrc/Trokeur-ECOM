import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TradeObject } from 'app/interfaces/TradeObjectInterface';
import { StateComponent } from '../state/state.component';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { S3serviceService } from 'app/fileservice/s3service.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { GenericImage } from 'app/interfaces/GenericImageInterface';

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
  images: GenericImage[] = [];
  imageUrl: Observable<SafeUrl> | undefined;
  urlArray: Observable<SafeUrl>[] = [];
  private modalRef!: NgbModalRef;


  constructor(public modalService: NgbModal, private config: S3serviceService, private router: Router, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.imageUrl = this.getPathToFirstImage();
    if (this.tradeObject) {
      for (const img of this.tradeObject.genericImages ?? []) {
        this.images.push(img);
      }
    }

    this.initUrlArray();
  }

  getPathToFirstImage(): Observable<SafeUrl> {
    let url: string;
    if (this.tradeObject?.genericImages?.[0]) {
      url = this.tradeObject.genericImages[0].imagePath;
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

  initUrlArray(): void {
    if (this.images.length > 0) {
      for (const img of this.images) {
        if (img.imagePath) {
          this.urlArray.push(this.getSafeUrl(img.imagePath.toString()));
        } else {
          this.urlArray.push(this.getSafeUrl('default.png'));
        }
      }
    } else {
      this.urlArray.push(this.getSafeUrl('default.png'));
    }
  }

  getSafeUrl(path: string): Observable<SafeUrl> {
    return this.config.getImage(path).pipe(
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

  trade(): void {
    this.router.navigate(['/trade'], {
      queryParams: {
        askedProductId: this.tradeObject?.id
      },
    });
  }
}
