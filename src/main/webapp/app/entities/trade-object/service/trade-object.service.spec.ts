import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITradeObject } from '../trade-object.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../trade-object.test-samples';

import { TradeObjectService } from './trade-object.service';

const requireRestSample: ITradeObject = {
  ...sampleWithRequiredData,
};

describe('TradeObject Service', () => {
  let service: TradeObjectService;
  let httpMock: HttpTestingController;
  let expectedResult: ITradeObject | ITradeObject[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TradeObjectService);
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

    it('should create a TradeObject', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const tradeObject = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(tradeObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TradeObject', () => {
      const tradeObject = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(tradeObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TradeObject', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TradeObject', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TradeObject', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTradeObjectToCollectionIfMissing', () => {
      it('should add a TradeObject to an empty array', () => {
        const tradeObject: ITradeObject = sampleWithRequiredData;
        expectedResult = service.addTradeObjectToCollectionIfMissing([], tradeObject);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tradeObject);
      });

      it('should not add a TradeObject to an array that contains it', () => {
        const tradeObject: ITradeObject = sampleWithRequiredData;
        const tradeObjectCollection: ITradeObject[] = [
          {
            ...tradeObject,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTradeObjectToCollectionIfMissing(tradeObjectCollection, tradeObject);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TradeObject to an array that doesn't contain it", () => {
        const tradeObject: ITradeObject = sampleWithRequiredData;
        const tradeObjectCollection: ITradeObject[] = [sampleWithPartialData];
        expectedResult = service.addTradeObjectToCollectionIfMissing(tradeObjectCollection, tradeObject);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tradeObject);
      });

      it('should add only unique TradeObject to an array', () => {
        const tradeObjectArray: ITradeObject[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const tradeObjectCollection: ITradeObject[] = [sampleWithRequiredData];
        expectedResult = service.addTradeObjectToCollectionIfMissing(tradeObjectCollection, ...tradeObjectArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const tradeObject: ITradeObject = sampleWithRequiredData;
        const tradeObject2: ITradeObject = sampleWithPartialData;
        expectedResult = service.addTradeObjectToCollectionIfMissing([], tradeObject, tradeObject2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tradeObject);
        expect(expectedResult).toContain(tradeObject2);
      });

      it('should accept null and undefined values', () => {
        const tradeObject: ITradeObject = sampleWithRequiredData;
        expectedResult = service.addTradeObjectToCollectionIfMissing([], null, tradeObject, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tradeObject);
      });

      it('should return initial array if no TradeObject is added', () => {
        const tradeObjectCollection: ITradeObject[] = [sampleWithRequiredData];
        expectedResult = service.addTradeObjectToCollectionIfMissing(tradeObjectCollection, undefined, null);
        expect(expectedResult).toEqual(tradeObjectCollection);
      });
    });

    describe('compareTradeObject', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTradeObject(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTradeObject(entity1, entity2);
        const compareResult2 = service.compareTradeObject(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTradeObject(entity1, entity2);
        const compareResult2 = service.compareTradeObject(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTradeObject(entity1, entity2);
        const compareResult2 = service.compareTradeObject(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
