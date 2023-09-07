import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITradeOffer } from '../trade-offer.model';
import { TradeOfferService } from '../service/trade-offer.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './trade-offer-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TradeOfferDeleteDialogComponent {
  tradeOffer?: ITradeOffer;

  constructor(protected tradeOfferService: TradeOfferService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.tradeOfferService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
