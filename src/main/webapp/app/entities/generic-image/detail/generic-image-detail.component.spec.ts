import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { GenericImageDetailComponent } from './generic-image-detail.component';

describe('GenericImage Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericImageDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: GenericImageDetailComponent,
              resolve: { genericImage: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding()
        ),
      ],
    })
      .overrideTemplate(GenericImageDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load genericImage on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', GenericImageDetailComponent);

      // THEN
      expect(instance.genericImage).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
