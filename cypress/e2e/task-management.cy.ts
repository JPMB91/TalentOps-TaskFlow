describe('Task Management', () => {
  beforeEach(() => {
    cy.login('john@test.com', 'password123');
    cy.visit('/projects/project-123');
  });

  it('should create a new task', () => {
    cy.intercept('POST', '/api/projects/project-123/tasks', { fixture: 'task-created.json' }).as('createTask');

    cy.get('[data-cy=add-task]').click();

    cy.get('[data-cy=task-title]').type('Implementar login');
    cy.get('[data-cy=task-description]').type('Crear sistema de autenticación');
    cy.get('[data-cy=task-priority]').select('high');
    cy.get('[data-cy=task-due-date]').type('2024-02-15');

    cy.get('[data-cy=create-task]').click();

    cy.wait('@createTask');
    cy.contains('Implementar login').should('be.visible');
    cy.get('[data-cy=task-status]').should('contain', 'To Do');
  });

  it('should move task through different statuses', () => {
    cy.intercept('PUT', '/api/tasks/task-456', (req) => {
      expect(req.body.status).to.equal('in_progress');
      req.reply({ fixture: 'task-updated.json' });
    }).as('updateTask');

    // Drag task from "To Do" to "In Progress"
    cy.get('[data-cy=task-card]').contains('Implementar login')
      .drag('[data-cy=status-column=in_progress]');

    cy.wait('@updateTask');
    cy.get('[data-cy=status-column=in_progress]')
      .should('contain', 'Implementar login');
  });

  it('should filter tasks by status', () => {
    cy.intercept('GET', '/api/projects/project-123/tasks', { fixture: 'tasks-list.json' }).as('getTasks');

    cy.visit('/projects/project-123');
    cy.wait('@getTasks');

    // Filter by "Done" status
    cy.get('[data-cy=filter-select]').select('done');

    cy.get('[data-cy=task-card]').should('have.length', 1);
    cy.get('[data-cy=task-card]').should('contain', 'Task Completada');
  });

  it('should delete a task', () => {
    cy.intercept('DELETE', '/api/tasks/task-456', { statusCode: 200 }).as('deleteTask');

    cy.get('[data-cy=task-card]').contains('Implementar login')
      .find('[data-cy=delete-task]').click();

    cy.get('[data-cy=confirm-delete]').click();

    cy.wait('@deleteTask');
    cy.contains('Implementar login').should('not.exist');
  });
});
