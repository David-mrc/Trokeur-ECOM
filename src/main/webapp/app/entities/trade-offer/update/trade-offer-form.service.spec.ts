import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../trade-offer.test-samples';

import { TradeOfferFormService } from './trade-offer-form.service';

describe('TradeOffer Form Service', () => {
  let service: TradeOfferFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TradeOfferFormService);
  });

  describe('Service methods', () => {
    describe('createTradeOfferFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTradeOfferFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            state: expect.any(Object),
            tradeObjects: expect.any(Object),
            trockeurUsers: expect.any(Object),
          })
        );
      });

      it('passing ITradeOffer should create a new form with FormGroup', () => {
        const formGroup = service.createTradeOfferFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            state: expect.any(Object),
            tradeObjects: expect.any(Object),
            trockeurUsers: expect.any(Object),
          })
        );
      });
    });

    describe('getTradeOffer', () => {
      it('should return NewTradeOffer for default TradeOffer initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTradeOfferFormGroup(sampleWithNewData);

        const tradeOffer = service.getTradeOffer(formGroup) as any;

        expect(tradeOffer).toMatchObject(sampleWithNewData);
      });

      it('should return NewTradeOffer for empty TradeOffer initial value', () => {
        const formGroup = service.createTradeOfferFormGroup();

        const tradeOffer = service.getTradeOffer(formGroup) as any;

        expect(tradeOffer).toMatchObject({});
      });

      it('should return ITradeOffer', () => {
        const formGroup = service.createTradeOfferFormGroup(sampleWithRequiredData);

        const tradeOffer = service.getTradeOffer(formGroup) as any;

        expect(tradeOffer).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITradeOffer should not enable id FormControl', () => {
        const formGroup = service.createTradeOfferFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTradeOffer should disable id FormControl', () => {
        const formGroup = service.createTradeOfferFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
