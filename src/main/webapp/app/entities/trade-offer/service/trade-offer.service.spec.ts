import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ITradeOffer } from '../trade-offer.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../trade-offer.test-samples';

import { TradeOfferService, RestTradeOffer } from './trade-offer.service';

const requireRestSample: RestTradeOffer = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.format(DATE_FORMAT),
};

describe('TradeOffer Service', () => {
  let service: TradeOfferService;
  let httpMock: HttpTestingController;
  let expectedResult: ITradeOffer | ITradeOffer[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TradeOfferService);
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

    it('should create a TradeOffer', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const tradeOffer = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(tradeOffer).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TradeOffer', () => {
      const tradeOffer = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(tradeOffer).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TradeOffer', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TradeOffer', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TradeOffer', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTradeOfferToCollectionIfMissing', () => {
      it('should add a TradeOffer to an empty array', () => {
        const tradeOffer: ITradeOffer = sampleWithRequiredData;
        expectedResult = service.addTradeOfferToCollectionIfMissing([], tradeOffer);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tradeOffer);
      });

      it('should not add a TradeOffer to an array that contains it', () => {
        const tradeOffer: ITradeOffer = sampleWithRequiredData;
        const tradeOfferCollection: ITradeOffer[] = [
          {
            ...tradeOffer,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTradeOfferToCollectionIfMissing(tradeOfferCollection, tradeOffer);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TradeOffer to an array that doesn't contain it", () => {
        const tradeOffer: ITradeOffer = sampleWithRequiredData;
        const tradeOfferCollection: ITradeOffer[] = [sampleWithPartialData];
        expectedResult = service.addTradeOfferToCollectionIfMissing(tradeOfferCollection, tradeOffer);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tradeOffer);
      });

      it('should add only unique TradeOffer to an array', () => {
        const tradeOfferArray: ITradeOffer[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const tradeOfferCollection: ITradeOffer[] = [sampleWithRequiredData];
        expectedResult = service.addTradeOfferToCollectionIfMissing(tradeOfferCollection, ...tradeOfferArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const tradeOffer: ITradeOffer = sampleWithRequiredData;
        const tradeOffer2: ITradeOffer = sampleWithPartialData;
        expectedResult = service.addTradeOfferToCollectionIfMissing([], tradeOffer, tradeOffer2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tradeOffer);
        expect(expectedResult).toContain(tradeOffer2);
      });

      it('should accept null and undefined values', () => {
        const tradeOffer: ITradeOffer = sampleWithRequiredData;
        expectedResult = service.addTradeOfferToCollectionIfMissing([], null, tradeOffer, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tradeOffer);
      });

      it('should return initial array if no TradeOffer is added', () => {
        const tradeOfferCollection: ITradeOffer[] = [sampleWithRequiredData];
        expectedResult = service.addTradeOfferToCollectionIfMissing(tradeOfferCollection, undefined, null);
        expect(expectedResult).toEqual(tradeOfferCollection);
      });
    });

    describe('compareTradeOffer', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTradeOffer(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTradeOffer(entity1, entity2);
        const compareResult2 = service.compareTradeOffer(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTradeOffer(entity1, entity2);
        const compareResult2 = service.compareTradeOffer(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTradeOffer(entity1, entity2);
        const compareResult2 = service.compareTradeOffer(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
