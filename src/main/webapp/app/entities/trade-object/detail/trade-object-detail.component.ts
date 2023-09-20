import { TradeObjectService } from './../service/trade-object.service';
import { IUser } from './../../user/user.model';
import { ITrockeurUser } from './../../trockeur-user/trockeur-user.model';
import { TrockeurUserService } from './../../trockeur-user/service/trockeur-user.service';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ITradeObject } from '../trade-object.model';
import { DataUtils } from 'app/core/util/data-util.service';

import { S3serviceService } from 'app/fileservice/s3service.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { GenericImage } from 'app/interfaces/GenericImageInterface';

@Component({
  standalone: true,
  styleUrls: ['./trade-object-detail.component.scss'],
  selector: 'jhi-trade-object-detail',
  templateUrl: './trade-object-detail.component.html',
  imports: [SharedModule, RouterModule, NgbCarouselModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe, CommonModule],
})
export class TradeObjectDetailComponent implements OnInit {
  // TODO 1 : afficher les vraies images de l'objet dans l'html
  // TODO 2 : afficher le composant state pour l'état au lieu de l'afficher textuellement
  @Input() tradeObject: ITradeObject | null = null;
  images: GenericImage[] = [];
  urlArray: Observable<SafeUrl>[] = [];
  authenticatedUser: Account | undefined;
  loginOfUserOfObject: string | undefined;

  constructor(
    private _accountService: AccountService,
    private _trockeurUserService: TrockeurUserService,
    private _tradeObjectService: TradeObjectService,
    protected dataUtils: DataUtils,
    protected activatedRoute: ActivatedRoute,
    private config: S3serviceService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this._accountService.identity().subscribe((user: Account | null) => {
      if (user != null) {
        this.authenticatedUser = user;
      } else {
        this.authenticatedUser = undefined;
      }
    });
    if (this.tradeObject?.trockeurUser) {
      this._trockeurUserService.findUserOfTrockeurUserId(this.tradeObject.trockeurUser.id).subscribe((user: IUser | null) => {
        if (user != null) {
          this.loginOfUserOfObject = user.login;
        } else {
          this.loginOfUserOfObject = undefined;
        }
      });
    }
    if (this.tradeObject) {
      for (const img of this.tradeObject.genericImages ?? []) {
        this.images.push(img);
      }
    }

    this.initUrlArray();
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

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }

  getUserLogin(): string | undefined {
    if (this.authenticatedUser) {
      return this.authenticatedUser.login;
    } else {
      return undefined;
    }
  }

  delete(): void {
    if(this.tradeObject) {
      this._tradeObjectService.disableTradeObject(this.tradeObject.id).subscribe(() => {
        this.previousState();
      });
    }
  }
}
