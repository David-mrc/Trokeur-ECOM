import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { IGenericImage } from '../generic-image.model';
import { GenericImageService } from '../service/generic-image.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './generic-image-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class GenericImageDeleteDialogComponent {
  genericImage?: IGenericImage;

  constructor(protected genericImageService: GenericImageService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.genericImageService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
