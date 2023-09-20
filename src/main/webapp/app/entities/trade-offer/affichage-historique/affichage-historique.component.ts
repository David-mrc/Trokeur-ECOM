import { ITradeObject } from 'app/entities/trade-object/trade-object.model';
import { ITradeOffer } from 'app/entities/trade-offer/trade-offer.model';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TradeOfferService } from '../service/trade-offer.service';
import { TradeObjectService } from 'app/entities/trade-object/service/trade-object.service';
import { IUser } from 'app/entities/user/user.model';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TradeOfferState } from 'app/entities/enumerations/trade-offer-state.model';
import { TrockeurUserService } from 'app/entities/trockeur-user/service/trockeur-user.service';
import { User } from 'app/interfaces/UserInterface';

@Component({
  selector: 'app-affichage-historique',
  templateUrl: './affichage-historique.component.html',
  standalone: true,
  imports: [NgIf, FontAwesomeModule, CommonModule, NgbModule],
  styleUrls: ['./affichage-historique.component.scss'],
})

export class AffichageHistoriqueComponent implements OnInit {
  @Input() tradeOffer: ITradeOffer | undefined;
  @Input() recues: boolean = false;
  @Input() propose: boolean = false;
  @ViewChild('modalSuccess') modalSuccess: any;
  @ViewChild('modalFail') modalFail: any;

  proposedObject: ITradeObject | undefined;
  wantedObject: ITradeObject | undefined;
  proposingUser: IUser | undefined;
  offeringUser: IUser | undefined;
  leftObject: ITradeObject | undefined;
  rightObject: ITradeObject | undefined;
  leftUser: IUser | undefined;
  rightUser: IUser | undefined;
  contactEmail: string | undefined;
  
  private modalRef!: NgbModalRef;

  constructor(private router: Router, 
    private _tradeOfferService: TradeOfferService, 
    private _tradeObjectService: TradeObjectService,
    private _trockeruUserService: TrockeurUserService, 
    private _accountService: AccountService, 
    private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadObjects();
    console.log(this.recues, this.propose)
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
        this._trockeruUserService.findUserByLogin(this.rightUser?.login).subscribe((user) => {
          this.contactEmail = user?.email;
        });
      }
    })
  }

  CancelTransaction() {
    this._tradeOfferService.cancelTradeOffer(this.tradeOffer?.id).subscribe(() => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/troks-proposes']);
      }); 
    });
  }

  RefuseTransaction() {
    this._tradeOfferService.refuseTradeOffer(this.tradeOffer?.id).subscribe(() => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/troks-recus']);
      }); 
    });
  }

  AcceptTransaction() {
    this._tradeOfferService.acceptTradeOffer(this.tradeOffer?.id).subscribe((accepted: boolean | undefined) => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/troks-recus']);
      }); 
      if (accepted) {
        this.openModal(this.modalSuccess);
      } else {
        this.openModal(this.modalFail);
      }
    });
  }

  openModal(content: any): void {
    if (this.modalService) {
      this.modalRef = this.modalService.open(content, { centered: true });
    }
  }

  closeModal(): void {
    this.modalRef.close('Cross click');
  }

  getClassMap() {
    return {
      'background-with-opacity-vert' : this.tradeOffer?.state == TradeOfferState.ACCEPTE,
      'background-with-opacity-rouge' : this.tradeOffer?.state == TradeOfferState.REFUSE,
      'background-with-opacity-jaune' : this.tradeOffer?.state == TradeOfferState.EN_COURS,
    }
  }



}


