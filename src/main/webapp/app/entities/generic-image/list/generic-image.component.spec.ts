import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { GenericImageService } from '../service/generic-image.service';

import { GenericImageComponent } from './generic-image.component';

describe('GenericImage Management Component', () => {
  let comp: GenericImageComponent;
  let fixture: ComponentFixture<GenericImageComponent>;
  let service: GenericImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'generic-image', component: GenericImageComponent }]),
        HttpClientTestingModule,
        GenericImageComponent,
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
      .overrideTemplate(GenericImageComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GenericImageComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(GenericImageService);

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
    expect(comp.genericImages?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to genericImageService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getGenericImageIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getGenericImageIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
