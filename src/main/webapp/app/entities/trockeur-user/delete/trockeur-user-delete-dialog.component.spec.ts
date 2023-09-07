jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { TrockeurUserService } from '../service/trockeur-user.service';

import { TrockeurUserDeleteDialogComponent } from './trockeur-user-delete-dialog.component';

describe('TrockeurUser Management Delete Component', () => {
  let comp: TrockeurUserDeleteDialogComponent;
  let fixture: ComponentFixture<TrockeurUserDeleteDialogComponent>;
  let service: TrockeurUserService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TrockeurUserDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(TrockeurUserDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TrockeurUserDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TrockeurUserService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      })
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
