import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ObjectCategoryFormService } from './object-category-form.service';
import { ObjectCategoryService } from '../service/object-category.service';
import { IObjectCategory } from '../object-category.model';

import { ObjectCategoryUpdateComponent } from './object-category-update.component';

describe('ObjectCategory Management Update Component', () => {
  let comp: ObjectCategoryUpdateComponent;
  let fixture: ComponentFixture<ObjectCategoryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let objectCategoryFormService: ObjectCategoryFormService;
  let objectCategoryService: ObjectCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ObjectCategoryUpdateComponent],
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
      .overrideTemplate(ObjectCategoryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ObjectCategoryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    objectCategoryFormService = TestBed.inject(ObjectCategoryFormService);
    objectCategoryService = TestBed.inject(ObjectCategoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const objectCategory: IObjectCategory = { id: 456 };

      activatedRoute.data = of({ objectCategory });
      comp.ngOnInit();

      expect(comp.objectCategory).toEqual(objectCategory);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IObjectCategory>>();
      const objectCategory = { id: 123 };
      jest.spyOn(objectCategoryFormService, 'getObjectCategory').mockReturnValue(objectCategory);
      jest.spyOn(objectCategoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ objectCategory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: objectCategory }));
      saveSubject.complete();

      // THEN
      expect(objectCategoryFormService.getObjectCategory).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(objectCategoryService.update).toHaveBeenCalledWith(expect.objectContaining(objectCategory));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IObjectCategory>>();
      const objectCategory = { id: 123 };
      jest.spyOn(objectCategoryFormService, 'getObjectCategory').mockReturnValue({ id: null });
      jest.spyOn(objectCategoryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ objectCategory: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: objectCategory }));
      saveSubject.complete();

      // THEN
      expect(objectCategoryFormService.getObjectCategory).toHaveBeenCalled();
      expect(objectCategoryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IObjectCategory>>();
      const objectCategory = { id: 123 };
      jest.spyOn(objectCategoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ objectCategory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(objectCategoryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
