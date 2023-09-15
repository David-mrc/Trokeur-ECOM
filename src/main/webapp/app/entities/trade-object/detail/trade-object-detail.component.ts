import { Component, Input } from '@angular/core';
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
export class TradeObjectDetailComponent {
  // TODO 1 : afficher les vraies images de l'objet dans l'html
  // TODO 2 : afficher le composant state pour l'état au lieu de l'afficher textuellement
  // TODO 3 : mapper le bouton "Troker"
  @Input() tradeObject: ITradeObject | null = null;
  images = this.tradeObject?.genericImages;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }

}
