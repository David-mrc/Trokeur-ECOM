import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../object-category.test-samples';

import { ObjectCategoryFormService } from './object-category-form.service';

describe('ObjectCategory Form Service', () => {
  let service: ObjectCategoryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjectCategoryFormService);
  });

  describe('Service methods', () => {
    describe('createObjectCategoryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createObjectCategoryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            tradeObjects: expect.any(Object),
          })
        );
      });

      it('passing IObjectCategory should create a new form with FormGroup', () => {
        const formGroup = service.createObjectCategoryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            tradeObjects: expect.any(Object),
          })
        );
      });
    });

    describe('getObjectCategory', () => {
      it('should return NewObjectCategory for default ObjectCategory initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createObjectCategoryFormGroup(sampleWithNewData);

        const objectCategory = service.getObjectCategory(formGroup) as any;

        expect(objectCategory).toMatchObject(sampleWithNewData);
      });

      it('should return NewObjectCategory for empty ObjectCategory initial value', () => {
        const formGroup = service.createObjectCategoryFormGroup();

        const objectCategory = service.getObjectCategory(formGroup) as any;

        expect(objectCategory).toMatchObject({});
      });

      it('should return IObjectCategory', () => {
        const formGroup = service.createObjectCategoryFormGroup(sampleWithRequiredData);

        const objectCategory = service.getObjectCategory(formGroup) as any;

        expect(objectCategory).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IObjectCategory should not enable id FormControl', () => {
        const formGroup = service.createObjectCategoryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewObjectCategory should disable id FormControl', () => {
        const formGroup = service.createObjectCategoryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
