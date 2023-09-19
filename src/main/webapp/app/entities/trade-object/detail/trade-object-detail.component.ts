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

@Component({
  standalone: true,
  styleUrls: ['./trade-object-detail.component.scss'],
  selector: 'jhi-trade-object-detail',
  templateUrl: './trade-object-detail.component.html',
  imports: [SharedModule, RouterModule, NgbCarouselModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class TradeObjectDetailComponent implements OnInit {
  // TODO 1 : afficher les vraies images de l'objet dans l'html
  // TODO 2 : afficher le composant state pour l'état au lieu de l'afficher textuellement
  @Input() tradeObject: ITradeObject | null = null;
  images = this.tradeObject?.genericImages;
  authenticatedUser: Account | undefined;
  loginOfUserOfObject: string | undefined;

  constructor(private _accountService: AccountService,
    private _trockeurUserService: TrockeurUserService,
    private _tradeObjectService: TradeObjectService,
    protected dataUtils: DataUtils,
    protected activatedRoute: ActivatedRoute,) {}

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

  delete(tradeObject: ITradeObject): void {
    console.log(tradeObject);
    this.previousState();
    //TODO : Corriger la suppression (ineffective pour l'instant)
    this._tradeObjectService.delete(tradeObject.id);
  }

}


