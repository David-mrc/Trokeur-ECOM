import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RegisterService } from './register.service';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Registration } from './register.model';

describe('RegisterService Service', () => {
  let service: RegisterService;
  let httpMock: HttpTestingController;
  let applicationConfigService: ApplicationConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(RegisterService);
    applicationConfigService = TestBed.inject(ApplicationConfigService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Service methods', () => {
    it('should call register endpoint with correct values', () => {
      // GIVEN
      const login = 'abc';
      const email = 'test@test.com';
      const password = 'pass';
      const firstName = 'John';
      const lastName = 'Doe';
      const city = '123 Main St';
      const postalCode = '12345';
      const langKey = 'FR';
      const registration = new Registration(login, email, password, firstName, lastName, city, postalCode, langKey);

      // WHEN
      service.save(registration).subscribe();

      const testRequest = httpMock.expectOne({
        method: 'POST',
        url: applicationConfigService.getEndpointFor('api/register'),
      });

      // THEN
      expect(testRequest.request.body).toEqual({ login, email, password, firstName, lastName, city, postalCode, langKey });
    });
  });
});
