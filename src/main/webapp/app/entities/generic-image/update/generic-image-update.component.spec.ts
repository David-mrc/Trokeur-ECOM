import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { GenericImageFormService } from './generic-image-form.service';
import { GenericImageService } from '../service/generic-image.service';
import { IGenericImage } from '../generic-image.model';
import { ITradeObject } from 'app/entities/trade-object/trade-object.model';
import { TradeObjectService } from 'app/entities/trade-object/service/trade-object.service';

import { GenericImageUpdateComponent } from './generic-image-update.component';

describe('GenericImage Management Update Component', () => {
  let comp: GenericImageUpdateComponent;
  let fixture: ComponentFixture<GenericImageUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let genericImageFormService: GenericImageFormService;
  let genericImageService: GenericImageService;
  let tradeObjectService: TradeObjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), GenericImageUpdateComponent],
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
      .overrideTemplate(GenericImageUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GenericImageUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    genericImageFormService = TestBed.inject(GenericImageFormService);
    genericImageService = TestBed.inject(GenericImageService);
    tradeObjectService = TestBed.inject(TradeObjectService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call TradeObject query and add missing value', () => {
      const genericImage: IGenericImage = { id: 456 };
      const tradeObject: ITradeObject = { id: 20179 };
      genericImage.tradeObject = tradeObject;

      const tradeObjectCollection: ITradeObject[] = [{ id: 19546 }];
      jest.spyOn(tradeObjectService, 'query').mockReturnValue(of(new HttpResponse({ body: tradeObjectCollection })));
      const additionalTradeObjects = [tradeObject];
      const expectedCollection: ITradeObject[] = [...additionalTradeObjects, ...tradeObjectCollection];
      jest.spyOn(tradeObjectService, 'addTradeObjectToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ genericImage });
      comp.ngOnInit();

      expect(tradeObjectService.query).toHaveBeenCalled();
      expect(tradeObjectService.addTradeObjectToCollectionIfMissing).toHaveBeenCalledWith(
        tradeObjectCollection,
        ...additionalTradeObjects.map(expect.objectContaining)
      );
      expect(comp.tradeObjectsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const genericImage: IGenericImage = { id: 456 };
      const tradeObject: ITradeObject = { id: 28765 };
      genericImage.tradeObject = tradeObject;

      activatedRoute.data = of({ genericImage });
      comp.ngOnInit();

      expect(comp.tradeObjectsSharedCollection).toContain(tradeObject);
      expect(comp.genericImage).toEqual(genericImage);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGenericImage>>();
      const genericImage = { id: 123 };
      jest.spyOn(genericImageFormService, 'getGenericImage').mockReturnValue(genericImage);
      jest.spyOn(genericImageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ genericImage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: genericImage }));
      saveSubject.complete();

      // THEN
      expect(genericImageFormService.getGenericImage).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(genericImageService.update).toHaveBeenCalledWith(expect.objectContaining(genericImage));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGenericImage>>();
      const genericImage = { id: 123 };
      jest.spyOn(genericImageFormService, 'getGenericImage').mockReturnValue({ id: null });
      jest.spyOn(genericImageService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ genericImage: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: genericImage }));
      saveSubject.complete();

      // THEN
      expect(genericImageFormService.getGenericImage).toHaveBeenCalled();
      expect(genericImageService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGenericImage>>();
      const genericImage = { id: 123 };
      jest.spyOn(genericImageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ genericImage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(genericImageService.update).toHaveBeenCalled();
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
  });
});
