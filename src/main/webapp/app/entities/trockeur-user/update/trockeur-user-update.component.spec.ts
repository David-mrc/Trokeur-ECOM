import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TrockeurUserFormService } from './trockeur-user-form.service';
import { TrockeurUserService } from '../service/trockeur-user.service';
import { ITrockeurUser } from '../trockeur-user.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { TrockeurUserUpdateComponent } from './trockeur-user-update.component';

describe('TrockeurUser Management Update Component', () => {
  let comp: TrockeurUserUpdateComponent;
  let fixture: ComponentFixture<TrockeurUserUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let trockeurUserFormService: TrockeurUserFormService;
  let trockeurUserService: TrockeurUserService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), TrockeurUserUpdateComponent],
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
      .overrideTemplate(TrockeurUserUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TrockeurUserUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    trockeurUserFormService = TestBed.inject(TrockeurUserFormService);
    trockeurUserService = TestBed.inject(TrockeurUserService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const trockeurUser: ITrockeurUser = { id: 456 };
      const user: IUser = { id: 12848 };
      trockeurUser.user = user;

      const userCollection: IUser[] = [{ id: 2860 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ trockeurUser });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const trockeurUser: ITrockeurUser = { id: 456 };
      const user: IUser = { id: 29734 };
      trockeurUser.user = user;

      activatedRoute.data = of({ trockeurUser });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.trockeurUser).toEqual(trockeurUser);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITrockeurUser>>();
      const trockeurUser = { id: 123 };
      jest.spyOn(trockeurUserFormService, 'getTrockeurUser').mockReturnValue(trockeurUser);
      jest.spyOn(trockeurUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ trockeurUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: trockeurUser }));
      saveSubject.complete();

      // THEN
      expect(trockeurUserFormService.getTrockeurUser).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(trockeurUserService.update).toHaveBeenCalledWith(expect.objectContaining(trockeurUser));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITrockeurUser>>();
      const trockeurUser = { id: 123 };
      jest.spyOn(trockeurUserFormService, 'getTrockeurUser').mockReturnValue({ id: null });
      jest.spyOn(trockeurUserService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ trockeurUser: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: trockeurUser }));
      saveSubject.complete();

      // THEN
      expect(trockeurUserFormService.getTrockeurUser).toHaveBeenCalled();
      expect(trockeurUserService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITrockeurUser>>();
      const trockeurUser = { id: 123 };
      jest.spyOn(trockeurUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ trockeurUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(trockeurUserService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
