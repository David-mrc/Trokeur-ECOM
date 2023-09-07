import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { IObjectCategory } from '../object-category.model';
import { ObjectCategoryService } from '../service/object-category.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './object-category-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ObjectCategoryDeleteDialogComponent {
  objectCategory?: IObjectCategory;

  constructor(protected objectCategoryService: ObjectCategoryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.objectCategoryService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
