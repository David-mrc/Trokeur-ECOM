import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('GenericImage e2e test', () => {
  const genericImagePageUrl = '/generic-image';
  const genericImagePageUrlPattern = new RegExp('/generic-image(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const genericImageSample = { imagePath: 'timide' };

  let genericImage;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/generic-images+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/generic-images').as('postEntityRequest');
    cy.intercept('DELETE', '/api/generic-images/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (genericImage) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/generic-images/${genericImage.id}`,
      }).then(() => {
        genericImage = undefined;
      });
    }
  });

  it('GenericImages menu should load GenericImages page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('generic-image');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('GenericImage').should('exist');
    cy.url().should('match', genericImagePageUrlPattern);
  });

  describe('GenericImage page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(genericImagePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create GenericImage page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/generic-image/new$'));
        cy.getEntityCreateUpdateHeading('GenericImage');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', genericImagePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/generic-images',
          body: genericImageSample,
        }).then(({ body }) => {
          genericImage = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/generic-images+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [genericImage],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(genericImagePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details GenericImage page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('genericImage');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', genericImagePageUrlPattern);
      });

      it('edit button click should load edit GenericImage page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('GenericImage');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', genericImagePageUrlPattern);
      });

      it('edit button click should load edit GenericImage page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('GenericImage');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', genericImagePageUrlPattern);
      });

      it('last delete button click should delete instance of GenericImage', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('genericImage').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', genericImagePageUrlPattern);

        genericImage = undefined;
      });
    });
  });

  describe('new GenericImage page', () => {
    beforeEach(() => {
      cy.visit(`${genericImagePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('GenericImage');
    });

    it('should create an instance of GenericImage', () => {
      cy.get(`[data-cy="imagePath"]`).type('Rue Salade');
      cy.get(`[data-cy="imagePath"]`).should('have.value', 'Rue Salade');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        genericImage = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', genericImagePageUrlPattern);
    });
  });
});
