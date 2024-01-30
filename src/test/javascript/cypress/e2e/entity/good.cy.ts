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

describe('Good e2e test', () => {
  const goodPageUrl = '/good';
  const goodPageUrlPattern = new RegExp('/good(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const goodSample = { amount: 92360 };

  let good;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/goods+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/goods').as('postEntityRequest');
    cy.intercept('DELETE', '/api/goods/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (good) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/goods/${good.id}`,
      }).then(() => {
        good = undefined;
      });
    }
  });

  it('Goods menu should load Goods page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('good');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Good').should('exist');
    cy.url().should('match', goodPageUrlPattern);
  });

  describe('Good page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(goodPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Good page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/good/new$'));
        cy.getEntityCreateUpdateHeading('Good');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', goodPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/goods',
          body: goodSample,
        }).then(({ body }) => {
          good = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/goods+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [good],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(goodPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Good page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('good');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', goodPageUrlPattern);
      });

      it('edit button click should load edit Good page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Good');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', goodPageUrlPattern);
      });

      it('edit button click should load edit Good page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Good');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', goodPageUrlPattern);
      });

      it('last delete button click should delete instance of Good', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('good').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', goodPageUrlPattern);

        good = undefined;
      });
    });
  });

  describe('new Good page', () => {
    beforeEach(() => {
      cy.visit(`${goodPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Good');
    });

    it('should create an instance of Good', () => {
      cy.get(`[data-cy="amount"]`).type('53091').should('have.value', '53091');

      cy.get(`[data-cy="name"]`).type('foreground Гранитный').should('have.value', 'foreground Гранитный');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        good = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', goodPageUrlPattern);
    });
  });
});
