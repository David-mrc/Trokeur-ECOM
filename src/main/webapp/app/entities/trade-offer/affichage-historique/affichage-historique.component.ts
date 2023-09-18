import { ITradeObject } from 'app/entities/trade-object/trade-object.model';
import { ITradeOffer } from 'app/entities/trade-offer/trade-offer.model';
import { Component, Input, OnInit } from '@angular/core';
import { TradeOfferService } from '../service/trade-offer.service';
import { TradeObjectService } from 'app/entities/trade-object/service/trade-object.service';
import { IUser } from 'app/entities/user/user.model';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'app-affichage-historique',
  templateUrl: './affichage-historique.component.html',
  styleUrls: ['./affichage-historique.component.scss']
})

export class AffichageHistoriqueComponent implements OnInit {
  @Input() tradeOffer: ITradeOffer | undefined;
  @Input() recues: boolean = false;
  @Input() propose: boolean = false;
  proposedObject: ITradeObject | undefined;
  wantedObject: ITradeObject | undefined;
  proposingUser: IUser | undefined;
  offeringUser: IUser | undefined;
  leftObject: ITradeObject | undefined;
  rightObject: ITradeObject | undefined;
  leftUser: IUser | undefined;
  rightUser: IUser | undefined;

  constructor(private _tradeOfferService: TradeOfferService, private _tradeObjectService: TradeObjectService, private _accountService: AccountService) {}

  ngOnInit(): void {
    this.loadObjects();
  }

  loadObjects(): void {
    if (this.tradeOffer) {
      this._tradeOfferService.getProposedTradeObject(this.tradeOffer.id).subscribe((tradeObject: ITradeObject | null) => {
        if (tradeObject) {
          this.proposedObject = tradeObject;
          this.loadProposingUser();
        }
      })
    }
  }

  loadProposingUser(): void {
    if (this.proposedObject) {
      this._tradeObjectService.getUsernameOfTradeObject(this.proposedObject.id).subscribe((user: IUser | undefined | null) => {
        if (user) {
          this.proposingUser = user;
        }
        this.loadWantedObject();
      })
    }
  }

  loadWantedObject(): void {
    if (this.tradeOffer) {
      this._tradeOfferService.getWantedTradeObject(this.tradeOffer.id).subscribe((tradeObject: ITradeObject | null) => {
        if (tradeObject) {
          this.wantedObject = tradeObject;
          this.loadOfferingUser();
        }
      })
    }
  }

  loadOfferingUser(): void {
    if (this.wantedObject) {
      this._tradeObjectService.getUsernameOfTradeObject(this.wantedObject.id).subscribe((user: IUser | undefined | null) => {
        if (user) {
          this.offeringUser = user;
        }
        this.loadLeftAndRight();
      })
    }
  }

  loadLeftAndRight(): void {
    this._accountService.identity().subscribe((user: Account | null) => {
      if (user) {
        if (user.login == this.proposingUser?.login) {
          this.leftObject = this.proposedObject;
          this.leftUser = this.proposingUser;
          this.rightObject = this.wantedObject;
          this.rightUser = this.offeringUser;
        } else {
          this.leftObject = this.wantedObject;
          this.leftUser = this.offeringUser;
          this.rightObject = this.proposedObject;
          this.rightUser = this.proposingUser;
        }
      }
    })
  }
}


