import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITrockeurUser } from '../trockeur-user.model';
import { TrockeurUserService } from '../service/trockeur-user.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './trockeur-user-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TrockeurUserDeleteDialogComponent {
  trockeurUser?: ITrockeurUser;

  constructor(protected trockeurUserService: TrockeurUserService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.trockeurUserService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
