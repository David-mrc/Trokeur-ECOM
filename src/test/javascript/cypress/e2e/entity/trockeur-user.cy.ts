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

describe('TrockeurUser e2e test', () => {
  const trockeurUserPageUrl = '/trockeur-user';
  const trockeurUserPageUrlPattern = new RegExp('/trockeur-user(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const trockeurUserSample = { address: 'Augustins lorsque', zipCode: '13849' };

  let trockeurUser;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/trockeur-users+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/trockeur-users').as('postEntityRequest');
    cy.intercept('DELETE', '/api/trockeur-users/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (trockeurUser) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/trockeur-users/${trockeurUser.id}`,
      }).then(() => {
        trockeurUser = undefined;
      });
    }
  });

  it('TrockeurUsers menu should load TrockeurUsers page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('trockeur-user');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('TrockeurUser').should('exist');
    cy.url().should('match', trockeurUserPageUrlPattern);
  });

  describe('TrockeurUser page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(trockeurUserPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create TrockeurUser page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/trockeur-user/new$'));
        cy.getEntityCreateUpdateHeading('TrockeurUser');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', trockeurUserPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/trockeur-users',
          body: trockeurUserSample,
        }).then(({ body }) => {
          trockeurUser = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/trockeur-users+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [trockeurUser],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(trockeurUserPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details TrockeurUser page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('trockeurUser');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', trockeurUserPageUrlPattern);
      });

      it('edit button click should load edit TrockeurUser page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TrockeurUser');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', trockeurUserPageUrlPattern);
      });

      it('edit button click should load edit TrockeurUser page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TrockeurUser');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', trockeurUserPageUrlPattern);
      });

      it('last delete button click should delete instance of TrockeurUser', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('trockeurUser').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', trockeurUserPageUrlPattern);

        trockeurUser = undefined;
      });
    });
  });

  describe('new TrockeurUser page', () => {
    beforeEach(() => {
      cy.visit(`${trockeurUserPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('TrockeurUser');
    });

    it('should create an instance of TrockeurUser', () => {
      cy.get(`[data-cy="address"]`).type('Films');
      cy.get(`[data-cy="address"]`).should('have.value', 'Films');

      cy.get(`[data-cy="zipCode"]`).type('49724');
      cy.get(`[data-cy="zipCode"]`).should('have.value', '49724');

      cy.get(`[data-cy="description"]`).type('../fake-data/blob/hipster.txt');
      cy.get(`[data-cy="description"]`).invoke('val').should('match', new RegExp('../fake-data/blob/hipster.txt'));

      cy.get(`[data-cy="profilePicturePath"]`).type('framboise');
      cy.get(`[data-cy="profilePicturePath"]`).should('have.value', 'framboise');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        trockeurUser = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', trockeurUserPageUrlPattern);
    });
  });
});
