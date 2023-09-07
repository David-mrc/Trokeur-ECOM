import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITrockeurUser } from '../trockeur-user.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../trockeur-user.test-samples';

import { TrockeurUserService } from './trockeur-user.service';

const requireRestSample: ITrockeurUser = {
  ...sampleWithRequiredData,
};

describe('TrockeurUser Service', () => {
  let service: TrockeurUserService;
  let httpMock: HttpTestingController;
  let expectedResult: ITrockeurUser | ITrockeurUser[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TrockeurUserService);
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

    it('should create a TrockeurUser', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const trockeurUser = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(trockeurUser).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TrockeurUser', () => {
      const trockeurUser = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(trockeurUser).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TrockeurUser', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TrockeurUser', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TrockeurUser', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTrockeurUserToCollectionIfMissing', () => {
      it('should add a TrockeurUser to an empty array', () => {
        const trockeurUser: ITrockeurUser = sampleWithRequiredData;
        expectedResult = service.addTrockeurUserToCollectionIfMissing([], trockeurUser);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(trockeurUser);
      });

      it('should not add a TrockeurUser to an array that contains it', () => {
        const trockeurUser: ITrockeurUser = sampleWithRequiredData;
        const trockeurUserCollection: ITrockeurUser[] = [
          {
            ...trockeurUser,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTrockeurUserToCollectionIfMissing(trockeurUserCollection, trockeurUser);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TrockeurUser to an array that doesn't contain it", () => {
        const trockeurUser: ITrockeurUser = sampleWithRequiredData;
        const trockeurUserCollection: ITrockeurUser[] = [sampleWithPartialData];
        expectedResult = service.addTrockeurUserToCollectionIfMissing(trockeurUserCollection, trockeurUser);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(trockeurUser);
      });

      it('should add only unique TrockeurUser to an array', () => {
        const trockeurUserArray: ITrockeurUser[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const trockeurUserCollection: ITrockeurUser[] = [sampleWithRequiredData];
        expectedResult = service.addTrockeurUserToCollectionIfMissing(trockeurUserCollection, ...trockeurUserArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const trockeurUser: ITrockeurUser = sampleWithRequiredData;
        const trockeurUser2: ITrockeurUser = sampleWithPartialData;
        expectedResult = service.addTrockeurUserToCollectionIfMissing([], trockeurUser, trockeurUser2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(trockeurUser);
        expect(expectedResult).toContain(trockeurUser2);
      });

      it('should accept null and undefined values', () => {
        const trockeurUser: ITrockeurUser = sampleWithRequiredData;
        expectedResult = service.addTrockeurUserToCollectionIfMissing([], null, trockeurUser, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(trockeurUser);
      });

      it('should return initial array if no TrockeurUser is added', () => {
        const trockeurUserCollection: ITrockeurUser[] = [sampleWithRequiredData];
        expectedResult = service.addTrockeurUserToCollectionIfMissing(trockeurUserCollection, undefined, null);
        expect(expectedResult).toEqual(trockeurUserCollection);
      });
    });

    describe('compareTrockeurUser', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTrockeurUser(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTrockeurUser(entity1, entity2);
        const compareResult2 = service.compareTrockeurUser(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTrockeurUser(entity1, entity2);
        const compareResult2 = service.compareTrockeurUser(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTrockeurUser(entity1, entity2);
        const compareResult2 = service.compareTrockeurUser(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
