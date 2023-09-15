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

describe('TradeOffer e2e test', () => {
  const tradeOfferPageUrl = '/trade-offer';
  const tradeOfferPageUrlPattern = new RegExp('/trade-offer(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const tradeOfferSample = { date: '2023-09-07', state: 'EN_COURS' };

  let tradeOffer;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/trade-offers+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/trade-offers').as('postEntityRequest');
    cy.intercept('DELETE', '/api/trade-offers/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (tradeOffer) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/trade-offers/${tradeOffer.id}`,
      }).then(() => {
        tradeOffer = undefined;
      });
    }
  });

  it('TradeOffers menu should load TradeOffers page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('trade-offer');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('TradeOffer').should('exist');
    cy.url().should('match', tradeOfferPageUrlPattern);
  });

  describe('TradeOffer page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(tradeOfferPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create TradeOffer page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/trade-offer/new$'));
        cy.getEntityCreateUpdateHeading('TradeOffer');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', tradeOfferPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/trade-offers',
          body: tradeOfferSample,
        }).then(({ body }) => {
          tradeOffer = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/trade-offers+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [tradeOffer],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(tradeOfferPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details TradeOffer page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('tradeOffer');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', tradeOfferPageUrlPattern);
      });

      it('edit button click should load edit TradeOffer page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TradeOffer');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', tradeOfferPageUrlPattern);
      });

      it('edit button click should load edit TradeOffer page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TradeOffer');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', tradeOfferPageUrlPattern);
      });

      it('last delete button click should delete instance of TradeOffer', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('tradeOffer').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', tradeOfferPageUrlPattern);

        tradeOffer = undefined;
      });
    });
  });

  describe('new TradeOffer page', () => {
    beforeEach(() => {
      cy.visit(`${tradeOfferPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('TradeOffer');
    });

    it('should create an instance of TradeOffer', () => {
      cy.get(`[data-cy="date"]`).type('2023-09-07');
      cy.get(`[data-cy="date"]`).blur();
      cy.get(`[data-cy="date"]`).should('have.value', '2023-09-07');

      cy.get(`[data-cy="state"]`).select('ACCEPTE');

      cy.get(`[data-cy="ownerID"]`).type('19190');
      cy.get(`[data-cy="ownerID"]`).should('have.value', '19190');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        tradeOffer = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', tradeOfferPageUrlPattern);
    });
  });
});
