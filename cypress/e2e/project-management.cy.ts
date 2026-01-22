describe('Project Management', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '**/api/projects',
      { fixture: 'projects-list.json' }
    ).as('getProjects');

    cy.login('john@test.com', 'testing1H!');
    cy.visit('/dashboard');

    cy.wait('@getProjects');
  });

  it('should create a new project', () => {
    cy.intercept(
      'GET',
      '**/api/projects',
      { fixture: 'projects-list.json' }
    ).as('getProjects');

    cy.intercept(
      'POST',
      '**/api/projects',
      { fixture: 'project-created.json' }
    ).as('createProject');

    cy.contains('Crear Proyecto').click();

    cy.get('[data-cy=project-name]').type('Mi Nuevo Proyecto');
    cy.get('[data-cy=project-description]').type('Descripción del proyecto');
    cy.get('[data-cy=member-email]').type('jane@test.com');
    cy.get('[data-cy=add-member]').click();

    cy.get('[data-cy=create-project]').click();

    cy.wait('@createProject');
    cy.contains('Proyecto creado exitosamente').should('be.visible');
    cy.contains('Mi Nuevo Proyecto').should('be.visible');
  });

  it('should display project details', () => {
    cy.intercept(
      'GET',
      '**/api/projects',
      { fixture: 'projects-list.json' }
    ).as('getProjects');

    cy.visit('/projects');
    cy.wait('@getProjects');

    cy.get('[data-cy=project-card]').first().click();

    cy.url().should('include', '/projects/');
    cy.get('[data-cy=project-title]').should('be.visible');
    cy.get('[data-cy=task-board]').should('be.visible');
  });

  it('should update project information', () => {
    const projectId = 'project-123';

    cy.intercept(
      'GET',
      `**/api/projects/${projectId}`,
      { fixture: 'project-detail.json' }
    ).as('getProject');

    cy.intercept(
      'PUT',
      `**/api/projects/${projectId}`,
      { fixture: 'project-updated.json' }
    ).as('updateProject');

    cy.visit(`/projects/${projectId}`);
    cy.wait('@getProject');

    cy.get('[data-cy=edit-project]').click();
    cy.get('[data-cy=project-name]').clear().type('Proyecto Actualizado');
    cy.get('[data-cy=save-changes]').click();

    cy.wait('@updateProject');
    cy.contains('Proyecto actualizado').should('be.visible');
  });
});
