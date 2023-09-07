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

describe('TradeObject e2e test', () => {
  const tradeObjectPageUrl = '/trade-object';
  const tradeObjectPageUrlPattern = new RegExp('/trade-object(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const tradeObjectSample = { name: 'Vélomobile Santé délégation', state: 'Neuf', stock: 16261 };

  let tradeObject;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/trade-objects+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/trade-objects').as('postEntityRequest');
    cy.intercept('DELETE', '/api/trade-objects/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (tradeObject) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/trade-objects/${tradeObject.id}`,
      }).then(() => {
        tradeObject = undefined;
      });
    }
  });

  it('TradeObjects menu should load TradeObjects page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('trade-object');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('TradeObject').should('exist');
    cy.url().should('match', tradeObjectPageUrlPattern);
  });

  describe('TradeObject page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(tradeObjectPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create TradeObject page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/trade-object/new$'));
        cy.getEntityCreateUpdateHeading('TradeObject');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', tradeObjectPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/trade-objects',
          body: tradeObjectSample,
        }).then(({ body }) => {
          tradeObject = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/trade-objects+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [tradeObject],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(tradeObjectPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details TradeObject page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('tradeObject');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', tradeObjectPageUrlPattern);
      });

      it('edit button click should load edit TradeObject page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TradeObject');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', tradeObjectPageUrlPattern);
      });

      it('edit button click should load edit TradeObject page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TradeObject');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', tradeObjectPageUrlPattern);
      });

      it('last delete button click should delete instance of TradeObject', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('tradeObject').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', tradeObjectPageUrlPattern);

        tradeObject = undefined;
      });
    });
  });

  describe('new TradeObject page', () => {
    beforeEach(() => {
      cy.visit(`${tradeObjectPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('TradeObject');
    });

    it('should create an instance of TradeObject', () => {
      cy.get(`[data-cy="name"]`).type('turquoise tranquille');
      cy.get(`[data-cy="name"]`).should('have.value', 'turquoise tranquille');

      cy.get(`[data-cy="description"]`).type('../fake-data/blob/hipster.txt');
      cy.get(`[data-cy="description"]`).invoke('val').should('match', new RegExp('../fake-data/blob/hipster.txt'));

      cy.get(`[data-cy="state"]`).select('Neuf');

      cy.get(`[data-cy="stock"]`).type('29421');
      cy.get(`[data-cy="stock"]`).should('have.value', '29421');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        tradeObject = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', tradeObjectPageUrlPattern);
    });
  });
});
