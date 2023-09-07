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

describe('ObjectCategory e2e test', () => {
  const objectCategoryPageUrl = '/object-category';
  const objectCategoryPageUrlPattern = new RegExp('/object-category(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const objectCategorySample = { name: 'Reggae' };

  let objectCategory;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/object-categories+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/object-categories').as('postEntityRequest');
    cy.intercept('DELETE', '/api/object-categories/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (objectCategory) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/object-categories/${objectCategory.id}`,
      }).then(() => {
        objectCategory = undefined;
      });
    }
  });

  it('ObjectCategories menu should load ObjectCategories page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('object-category');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ObjectCategory').should('exist');
    cy.url().should('match', objectCategoryPageUrlPattern);
  });

  describe('ObjectCategory page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(objectCategoryPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ObjectCategory page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/object-category/new$'));
        cy.getEntityCreateUpdateHeading('ObjectCategory');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', objectCategoryPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/object-categories',
          body: objectCategorySample,
        }).then(({ body }) => {
          objectCategory = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/object-categories+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [objectCategory],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(objectCategoryPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details ObjectCategory page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('objectCategory');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', objectCategoryPageUrlPattern);
      });

      it('edit button click should load edit ObjectCategory page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ObjectCategory');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', objectCategoryPageUrlPattern);
      });

      it('edit button click should load edit ObjectCategory page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ObjectCategory');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', objectCategoryPageUrlPattern);
      });

      it('last delete button click should delete instance of ObjectCategory', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('objectCategory').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', objectCategoryPageUrlPattern);

        objectCategory = undefined;
      });
    });
  });

  describe('new ObjectCategory page', () => {
    beforeEach(() => {
      cy.visit(`${objectCategoryPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ObjectCategory');
    });

    it('should create an instance of ObjectCategory', () => {
      cy.get(`[data-cy="name"]`).type('tunisien Directeur');
      cy.get(`[data-cy="name"]`).should('have.value', 'tunisien Directeur');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        objectCategory = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', objectCategoryPageUrlPattern);
    });
  });
});
