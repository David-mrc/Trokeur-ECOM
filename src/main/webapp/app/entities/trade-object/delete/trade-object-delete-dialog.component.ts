import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITradeObject } from '../trade-object.model';
import { TradeObjectService } from '../service/trade-object.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './trade-object-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TradeObjectDeleteDialogComponent {
  tradeObject?: ITradeObject;

  constructor(protected tradeObjectService: TradeObjectService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.tradeObjectService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
