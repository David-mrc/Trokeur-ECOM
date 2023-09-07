import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TradeOfferFormService } from './trade-offer-form.service';
import { TradeOfferService } from '../service/trade-offer.service';
import { ITradeOffer } from '../trade-offer.model';
import { ITradeObject } from 'app/entities/trade-object/trade-object.model';
import { TradeObjectService } from 'app/entities/trade-object/service/trade-object.service';
import { ITrockeurUser } from 'app/entities/trockeur-user/trockeur-user.model';
import { TrockeurUserService } from 'app/entities/trockeur-user/service/trockeur-user.service';

import { TradeOfferUpdateComponent } from './trade-offer-update.component';

describe('TradeOffer Management Update Component', () => {
  let comp: TradeOfferUpdateComponent;
  let fixture: ComponentFixture<TradeOfferUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let tradeOfferFormService: TradeOfferFormService;
  let tradeOfferService: TradeOfferService;
  let tradeObjectService: TradeObjectService;
  let trockeurUserService: TrockeurUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), TradeOfferUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TradeOfferUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TradeOfferUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    tradeOfferFormService = TestBed.inject(TradeOfferFormService);
    tradeOfferService = TestBed.inject(TradeOfferService);
    tradeObjectService = TestBed.inject(TradeObjectService);
    trockeurUserService = TestBed.inject(TrockeurUserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call TradeObject query and add missing value', () => {
      const tradeOffer: ITradeOffer = { id: 456 };
      const tradeObjects: ITradeObject[] = [{ id: 7416 }];
      tradeOffer.tradeObjects = tradeObjects;

      const tradeObjectCollection: ITradeObject[] = [{ id: 17955 }];
      jest.spyOn(tradeObjectService, 'query').mockReturnValue(of(new HttpResponse({ body: tradeObjectCollection })));
      const additionalTradeObjects = [...tradeObjects];
      const expectedCollection: ITradeObject[] = [...additionalTradeObjects, ...tradeObjectCollection];
      jest.spyOn(tradeObjectService, 'addTradeObjectToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ tradeOffer });
      comp.ngOnInit();

      expect(tradeObjectService.query).toHaveBeenCalled();
      expect(tradeObjectService.addTradeObjectToCollectionIfMissing).toHaveBeenCalledWith(
        tradeObjectCollection,
        ...additionalTradeObjects.map(expect.objectContaining)
      );
      expect(comp.tradeObjectsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call TrockeurUser query and add missing value', () => {
      const tradeOffer: ITradeOffer = { id: 456 };
      const trockeurUsers: ITrockeurUser[] = [{ id: 5531 }];
      tradeOffer.trockeurUsers = trockeurUsers;

      const trockeurUserCollection: ITrockeurUser[] = [{ id: 22538 }];
      jest.spyOn(trockeurUserService, 'query').mockReturnValue(of(new HttpResponse({ body: trockeurUserCollection })));
      const additionalTrockeurUsers = [...trockeurUsers];
      const expectedCollection: ITrockeurUser[] = [...additionalTrockeurUsers, ...trockeurUserCollection];
      jest.spyOn(trockeurUserService, 'addTrockeurUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ tradeOffer });
      comp.ngOnInit();

      expect(trockeurUserService.query).toHaveBeenCalled();
      expect(trockeurUserService.addTrockeurUserToCollectionIfMissing).toHaveBeenCalledWith(
        trockeurUserCollection,
        ...additionalTrockeurUsers.map(expect.objectContaining)
      );
      expect(comp.trockeurUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const tradeOffer: ITradeOffer = { id: 456 };
      const tradeObject: ITradeObject = { id: 26093 };
      tradeOffer.tradeObjects = [tradeObject];
      const trockeurUser: ITrockeurUser = { id: 9324 };
      tradeOffer.trockeurUsers = [trockeurUser];

      activatedRoute.data = of({ tradeOffer });
      comp.ngOnInit();

      expect(comp.tradeObjectsSharedCollection).toContain(tradeObject);
      expect(comp.trockeurUsersSharedCollection).toContain(trockeurUser);
      expect(comp.tradeOffer).toEqual(tradeOffer);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITradeOffer>>();
      const tradeOffer = { id: 123 };
      jest.spyOn(tradeOfferFormService, 'getTradeOffer').mockReturnValue(tradeOffer);
      jest.spyOn(tradeOfferService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tradeOffer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tradeOffer }));
      saveSubject.complete();

      // THEN
      expect(tradeOfferFormService.getTradeOffer).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(tradeOfferService.update).toHaveBeenCalledWith(expect.objectContaining(tradeOffer));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITradeOffer>>();
      const tradeOffer = { id: 123 };
      jest.spyOn(tradeOfferFormService, 'getTradeOffer').mockReturnValue({ id: null });
      jest.spyOn(tradeOfferService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tradeOffer: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tradeOffer }));
      saveSubject.complete();

      // THEN
      expect(tradeOfferFormService.getTradeOffer).toHaveBeenCalled();
      expect(tradeOfferService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITradeOffer>>();
      const tradeOffer = { id: 123 };
      jest.spyOn(tradeOfferService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tradeOffer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(tradeOfferService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareTradeObject', () => {
      it('Should forward to tradeObjectService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(tradeObjectService, 'compareTradeObject');
        comp.compareTradeObject(entity, entity2);
        expect(tradeObjectService.compareTradeObject).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareTrockeurUser', () => {
      it('Should forward to trockeurUserService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(trockeurUserService, 'compareTrockeurUser');
        comp.compareTrockeurUser(entity, entity2);
        expect(trockeurUserService.compareTrockeurUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
