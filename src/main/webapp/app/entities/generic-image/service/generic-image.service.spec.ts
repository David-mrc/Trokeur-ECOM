import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGenericImage } from '../generic-image.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../generic-image.test-samples';

import { GenericImageService } from './generic-image.service';

const requireRestSample: IGenericImage = {
  ...sampleWithRequiredData,
};

describe('GenericImage Service', () => {
  let service: GenericImageService;
  let httpMock: HttpTestingController;
  let expectedResult: IGenericImage | IGenericImage[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(GenericImageService);
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

    it('should create a GenericImage', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const genericImage = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(genericImage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a GenericImage', () => {
      const genericImage = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(genericImage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a GenericImage', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of GenericImage', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a GenericImage', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addGenericImageToCollectionIfMissing', () => {
      it('should add a GenericImage to an empty array', () => {
        const genericImage: IGenericImage = sampleWithRequiredData;
        expectedResult = service.addGenericImageToCollectionIfMissing([], genericImage);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(genericImage);
      });

      it('should not add a GenericImage to an array that contains it', () => {
        const genericImage: IGenericImage = sampleWithRequiredData;
        const genericImageCollection: IGenericImage[] = [
          {
            ...genericImage,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addGenericImageToCollectionIfMissing(genericImageCollection, genericImage);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a GenericImage to an array that doesn't contain it", () => {
        const genericImage: IGenericImage = sampleWithRequiredData;
        const genericImageCollection: IGenericImage[] = [sampleWithPartialData];
        expectedResult = service.addGenericImageToCollectionIfMissing(genericImageCollection, genericImage);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(genericImage);
      });

      it('should add only unique GenericImage to an array', () => {
        const genericImageArray: IGenericImage[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const genericImageCollection: IGenericImage[] = [sampleWithRequiredData];
        expectedResult = service.addGenericImageToCollectionIfMissing(genericImageCollection, ...genericImageArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const genericImage: IGenericImage = sampleWithRequiredData;
        const genericImage2: IGenericImage = sampleWithPartialData;
        expectedResult = service.addGenericImageToCollectionIfMissing([], genericImage, genericImage2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(genericImage);
        expect(expectedResult).toContain(genericImage2);
      });

      it('should accept null and undefined values', () => {
        const genericImage: IGenericImage = sampleWithRequiredData;
        expectedResult = service.addGenericImageToCollectionIfMissing([], null, genericImage, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(genericImage);
      });

      it('should return initial array if no GenericImage is added', () => {
        const genericImageCollection: IGenericImage[] = [sampleWithRequiredData];
        expectedResult = service.addGenericImageToCollectionIfMissing(genericImageCollection, undefined, null);
        expect(expectedResult).toEqual(genericImageCollection);
      });
    });

    describe('compareGenericImage', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareGenericImage(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareGenericImage(entity1, entity2);
        const compareResult2 = service.compareGenericImage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareGenericImage(entity1, entity2);
        const compareResult2 = service.compareGenericImage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareGenericImage(entity1, entity2);
        const compareResult2 = service.compareGenericImage(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
