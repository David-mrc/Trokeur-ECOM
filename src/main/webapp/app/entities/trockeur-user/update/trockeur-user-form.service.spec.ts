import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../trockeur-user.test-samples';

import { TrockeurUserFormService } from './trockeur-user-form.service';

describe('TrockeurUser Form Service', () => {
  let service: TrockeurUserFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrockeurUserFormService);
  });

  describe('Service methods', () => {
    describe('createTrockeurUserFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTrockeurUserFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            address: expect.any(Object),
            zipCode: expect.any(Object),
            description: expect.any(Object),
            profilePicturePath: expect.any(Object),
            user: expect.any(Object),
            tradeOffers: expect.any(Object),
          })
        );
      });

      it('passing ITrockeurUser should create a new form with FormGroup', () => {
        const formGroup = service.createTrockeurUserFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            address: expect.any(Object),
            zipCode: expect.any(Object),
            description: expect.any(Object),
            profilePicturePath: expect.any(Object),
            user: expect.any(Object),
            tradeOffers: expect.any(Object),
          })
        );
      });
    });

    describe('getTrockeurUser', () => {
      it('should return NewTrockeurUser for default TrockeurUser initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTrockeurUserFormGroup(sampleWithNewData);

        const trockeurUser = service.getTrockeurUser(formGroup) as any;

        expect(trockeurUser).toMatchObject(sampleWithNewData);
      });

      it('should return NewTrockeurUser for empty TrockeurUser initial value', () => {
        const formGroup = service.createTrockeurUserFormGroup();

        const trockeurUser = service.getTrockeurUser(formGroup) as any;

        expect(trockeurUser).toMatchObject({});
      });

      it('should return ITrockeurUser', () => {
        const formGroup = service.createTrockeurUserFormGroup(sampleWithRequiredData);

        const trockeurUser = service.getTrockeurUser(formGroup) as any;

        expect(trockeurUser).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITrockeurUser should not enable id FormControl', () => {
        const formGroup = service.createTrockeurUserFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTrockeurUser should disable id FormControl', () => {
        const formGroup = service.createTrockeurUserFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
