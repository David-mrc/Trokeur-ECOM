import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IObjectCategory } from '../object-category.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../object-category.test-samples';

import { ObjectCategoryService } from './object-category.service';

const requireRestSample: IObjectCategory = {
  ...sampleWithRequiredData,
};

describe('ObjectCategory Service', () => {
  let service: ObjectCategoryService;
  let httpMock: HttpTestingController;
  let expectedResult: IObjectCategory | IObjectCategory[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ObjectCategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a ObjectCategory', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const objectCategory = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(objectCategory).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ObjectCategory', () => {
      const objectCategory = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(objectCategory).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ObjectCategory', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ObjectCategory', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ObjectCategory', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addObjectCategoryToCollectionIfMissing', () => {
      it('should add a ObjectCategory to an empty array', () => {
        const objectCategory: IObjectCategory = sampleWithRequiredData;
        expectedResult = service.addObjectCategoryToCollectionIfMissing([], objectCategory);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(objectCategory);
      });

      it('should not add a ObjectCategory to an array that contains it', () => {
        const objectCategory: IObjectCategory = sampleWithRequiredData;
        const objectCategoryCollection: IObjectCategory[] = [
          {
            ...objectCategory,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addObjectCategoryToCollectionIfMissing(objectCategoryCollection, objectCategory);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ObjectCategory to an array that doesn't contain it", () => {
        const objectCategory: IObjectCategory = sampleWithRequiredData;
        const objectCategoryCollection: IObjectCategory[] = [sampleWithPartialData];
        expectedResult = service.addObjectCategoryToCollectionIfMissing(objectCategoryCollection, objectCategory);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(objectCategory);
      });

      it('should add only unique ObjectCategory to an array', () => {
        const objectCategoryArray: IObjectCategory[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const objectCategoryCollection: IObjectCategory[] = [sampleWithRequiredData];
        expectedResult = service.addObjectCategoryToCollectionIfMissing(objectCategoryCollection, ...objectCategoryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const objectCategory: IObjectCategory = sampleWithRequiredData;
        const objectCategory2: IObjectCategory = sampleWithPartialData;
        expectedResult = service.addObjectCategoryToCollectionIfMissing([], objectCategory, objectCategory2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(objectCategory);
        expect(expectedResult).toContain(objectCategory2);
      });

      it('should accept null and undefined values', () => {
        const objectCategory: IObjectCategory = sampleWithRequiredData;
        expectedResult = service.addObjectCategoryToCollectionIfMissing([], null, objectCategory, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(objectCategory);
      });

      it('should return initial array if no ObjectCategory is added', () => {
        const objectCategoryCollection: IObjectCategory[] = [sampleWithRequiredData];
        expectedResult = service.addObjectCategoryToCollectionIfMissing(objectCategoryCollection, undefined, null);
        expect(expectedResult).toEqual(objectCategoryCollection);
      });
    });

    describe('compareObjectCategory', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareObjectCategory(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareObjectCategory(entity1, entity2);
        const compareResult2 = service.compareObjectCategory(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareObjectCategory(entity1, entity2);
        const compareResult2 = service.compareObjectCategory(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareObjectCategory(entity1, entity2);
        const compareResult2 = service.compareObjectCategory(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
