import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TradeOfferService } from '../service/trade-offer.service';

import { TradeOfferComponent } from './trade-offer.component';

describe('TradeOffer Management Component', () => {
  let comp: TradeOfferComponent;
  let fixture: ComponentFixture<TradeOfferComponent>;
  let service: TradeOfferService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'trade-offer', component: TradeOfferComponent }]),
        HttpClientTestingModule,
        TradeOfferComponent,
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
      .overrideTemplate(TradeOfferComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TradeOfferComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TradeOfferService);

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
    expect(comp.tradeOffers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to tradeOfferService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getTradeOfferIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getTradeOfferIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
