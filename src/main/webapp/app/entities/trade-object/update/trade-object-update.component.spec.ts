import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TradeObjectFormService } from './trade-object-form.service';
import { TradeObjectService } from '../service/trade-object.service';
import { ITradeObject } from '../trade-object.model';
import { IObjectCategory } from 'app/entities/object-category/object-category.model';
import { ObjectCategoryService } from 'app/entities/object-category/service/object-category.service';
import { ITrockeurUser } from 'app/entities/trockeur-user/trockeur-user.model';
import { TrockeurUserService } from 'app/entities/trockeur-user/service/trockeur-user.service';

import { TradeObjectUpdateComponent } from './trade-object-update.component';

describe('TradeObject Management Update Component', () => {
  let comp: TradeObjectUpdateComponent;
  let fixture: ComponentFixture<TradeObjectUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let tradeObjectFormService: TradeObjectFormService;
  let tradeObjectService: TradeObjectService;
  let objectCategoryService: ObjectCategoryService;
  let trockeurUserService: TrockeurUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), TradeObjectUpdateComponent],
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
      .overrideTemplate(TradeObjectUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TradeObjectUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    tradeObjectFormService = TestBed.inject(TradeObjectFormService);
    tradeObjectService = TestBed.inject(TradeObjectService);
    objectCategoryService = TestBed.inject(ObjectCategoryService);
    trockeurUserService = TestBed.inject(TrockeurUserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ObjectCategory query and add missing value', () => {
      const tradeObject: ITradeObject = { id: 456 };
      const objectCategories: IObjectCategory[] = [{ id: 6333 }];
      tradeObject.objectCategories = objectCategories;

      const objectCategoryCollection: IObjectCategory[] = [{ id: 22785 }];
      jest.spyOn(objectCategoryService, 'query').mockReturnValue(of(new HttpResponse({ body: objectCategoryCollection })));
      const additionalObjectCategories = [...objectCategories];
      const expectedCollection: IObjectCategory[] = [...additionalObjectCategories, ...objectCategoryCollection];
      jest.spyOn(objectCategoryService, 'addObjectCategoryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ tradeObject });
      comp.ngOnInit();

      expect(objectCategoryService.query).toHaveBeenCalled();
      expect(objectCategoryService.addObjectCategoryToCollectionIfMissing).toHaveBeenCalledWith(
        objectCategoryCollection,
        ...additionalObjectCategories.map(expect.objectContaining)
      );
      expect(comp.objectCategoriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call TrockeurUser query and add missing value', () => {
      const tradeObject: ITradeObject = { id: 456 };
      const trockeurUser: ITrockeurUser = { id: 29561 };
      tradeObject.trockeurUser = trockeurUser;

      const trockeurUserCollection: ITrockeurUser[] = [{ id: 18539 }];
      jest.spyOn(trockeurUserService, 'query').mockReturnValue(of(new HttpResponse({ body: trockeurUserCollection })));
      const additionalTrockeurUsers = [trockeurUser];
      const expectedCollection: ITrockeurUser[] = [...additionalTrockeurUsers, ...trockeurUserCollection];
      jest.spyOn(trockeurUserService, 'addTrockeurUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ tradeObject });
      comp.ngOnInit();

      expect(trockeurUserService.query).toHaveBeenCalled();
      expect(trockeurUserService.addTrockeurUserToCollectionIfMissing).toHaveBeenCalledWith(
        trockeurUserCollection,
        ...additionalTrockeurUsers.map(expect.objectContaining)
      );
      expect(comp.trockeurUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const tradeObject: ITradeObject = { id: 456 };
      const objectCategory: IObjectCategory = { id: 28547 };
      tradeObject.objectCategories = [objectCategory];
      const trockeurUser: ITrockeurUser = { id: 6977 };
      tradeObject.trockeurUser = trockeurUser;

      activatedRoute.data = of({ tradeObject });
      comp.ngOnInit();

      expect(comp.objectCategoriesSharedCollection).toContain(objectCategory);
      expect(comp.trockeurUsersSharedCollection).toContain(trockeurUser);
      expect(comp.tradeObject).toEqual(tradeObject);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITradeObject>>();
      const tradeObject = { id: 123 };
      jest.spyOn(tradeObjectFormService, 'getTradeObject').mockReturnValue(tradeObject);
      jest.spyOn(tradeObjectService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tradeObject });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tradeObject }));
      saveSubject.complete();

      // THEN
      expect(tradeObjectFormService.getTradeObject).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(tradeObjectService.update).toHaveBeenCalledWith(expect.objectContaining(tradeObject));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITradeObject>>();
      const tradeObject = { id: 123 };
      jest.spyOn(tradeObjectFormService, 'getTradeObject').mockReturnValue({ id: null });
      jest.spyOn(tradeObjectService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tradeObject: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tradeObject }));
      saveSubject.complete();

      // THEN
      expect(tradeObjectFormService.getTradeObject).toHaveBeenCalled();
      expect(tradeObjectService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITradeObject>>();
      const tradeObject = { id: 123 };
      jest.spyOn(tradeObjectService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tradeObject });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(tradeObjectService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareObjectCategory', () => {
      it('Should forward to objectCategoryService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(objectCategoryService, 'compareObjectCategory');
        comp.compareObjectCategory(entity, entity2);
        expect(objectCategoryService.compareObjectCategory).toHaveBeenCalledWith(entity, entity2);
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
