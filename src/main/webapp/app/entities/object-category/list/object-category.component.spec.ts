import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ObjectCategoryService } from '../service/object-category.service';

import { ObjectCategoryComponent } from './object-category.component';

describe('ObjectCategory Management Component', () => {
  let comp: ObjectCategoryComponent;
  let fixture: ComponentFixture<ObjectCategoryComponent>;
  let service: ObjectCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'object-category', component: ObjectCategoryComponent }]),
        HttpClientTestingModule,
        ObjectCategoryComponent,
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
      .overrideTemplate(ObjectCategoryComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ObjectCategoryComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ObjectCategoryService);

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
    expect(comp.objectCategories?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to objectCategoryService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getObjectCategoryIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getObjectCategoryIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
