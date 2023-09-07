import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TradeOfferDetailComponent } from './trade-offer-detail.component';

describe('TradeOffer Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeOfferDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: TradeOfferDetailComponent,
              resolve: { tradeOffer: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(TradeOfferDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load tradeOffer on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', TradeOfferDetailComponent);

      // THEN
      expect(instance.tradeOffer).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
