import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../generic-image.test-samples';

import { GenericImageFormService } from './generic-image-form.service';

describe('GenericImage Form Service', () => {
  let service: GenericImageFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenericImageFormService);
  });

  describe('Service methods', () => {
    describe('createGenericImageFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGenericImageFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            imagePath: expect.any(Object),
            tradeObject: expect.any(Object),
          })
        );
      });

      it('passing IGenericImage should create a new form with FormGroup', () => {
        const formGroup = service.createGenericImageFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            imagePath: expect.any(Object),
            tradeObject: expect.any(Object),
          })
        );
      });
    });

    describe('getGenericImage', () => {
      it('should return NewGenericImage for default GenericImage initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createGenericImageFormGroup(sampleWithNewData);

        const genericImage = service.getGenericImage(formGroup) as any;

        expect(genericImage).toMatchObject(sampleWithNewData);
      });

      it('should return NewGenericImage for empty GenericImage initial value', () => {
        const formGroup = service.createGenericImageFormGroup();

        const genericImage = service.getGenericImage(formGroup) as any;

        expect(genericImage).toMatchObject({});
      });

      it('should return IGenericImage', () => {
        const formGroup = service.createGenericImageFormGroup(sampleWithRequiredData);

        const genericImage = service.getGenericImage(formGroup) as any;

        expect(genericImage).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGenericImage should not enable id FormControl', () => {
        const formGroup = service.createGenericImageFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGenericImage should disable id FormControl', () => {
        const formGroup = service.createGenericImageFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
