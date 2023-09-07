import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TrockeurUserService } from '../service/trockeur-user.service';

import { TrockeurUserComponent } from './trockeur-user.component';

describe('TrockeurUser Management Component', () => {
  let comp: TrockeurUserComponent;
  let fixture: ComponentFixture<TrockeurUserComponent>;
  let service: TrockeurUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'trockeur-user', component: TrockeurUserComponent }]),
        HttpClientTestingModule,
        TrockeurUserComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(TrockeurUserComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TrockeurUserComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TrockeurUserService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.trockeurUsers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to trockeurUserService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getTrockeurUserIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getTrockeurUserIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
