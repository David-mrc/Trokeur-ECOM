import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../trade-object.test-samples';

import { TradeObjectFormService } from './trade-object-form.service';

describe('TradeObject Form Service', () => {
  let service: TradeObjectFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TradeObjectFormService);
  });

  describe('Service methods', () => {
    describe('createTradeObjectFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTradeObjectFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            state: expect.any(Object),
            stock: expect.any(Object),
            objectCategories: expect.any(Object),
            trockeurUser: expect.any(Object),
            tradeOffers: expect.any(Object),
          })
        );
      });

      it('passing ITradeObject should create a new form with FormGroup', () => {
        const formGroup = service.createTradeObjectFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            state: expect.any(Object),
            stock: expect.any(Object),
            objectCategories: expect.any(Object),
            trockeurUser: expect.any(Object),
            tradeOffers: expect.any(Object),
          })
        );
      });
    });

    describe('getTradeObject', () => {
      it('should return NewTradeObject for default TradeObject initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTradeObjectFormGroup(sampleWithNewData);

        const tradeObject = service.getTradeObject(formGroup) as any;

        expect(tradeObject).toMatchObject(sampleWithNewData);
      });

      it('should return NewTradeObject for empty TradeObject initial value', () => {
        const formGroup = service.createTradeObjectFormGroup();

        const tradeObject = service.getTradeObject(formGroup) as any;

        expect(tradeObject).toMatchObject({});
      });

      it('should return ITradeObject', () => {
        const formGroup = service.createTradeObjectFormGroup(sampleWithRequiredData);

        const tradeObject = service.getTradeObject(formGroup) as any;

        expect(tradeObject).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITradeObject should not enable id FormControl', () => {
        const formGroup = service.createTradeObjectFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTradeObject should disable id FormControl', () => {
        const formGroup = service.createTradeObjectFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
