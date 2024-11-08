///<reference types="cypress" />

//suite
describe('tarefas', () => {
    it('deve cadastrar uma nova tarefa', () => {

        const taskName = 'Ler um livro de node.js'

        cy.request({
            url: 'http://localhost:3333/helper/tasks',
            method: 'DELETE',
            body: { name: taskName }
        }).then(response => {
            expect(response.status).to.eq(204)
        })

        cy.visit('http://localhost:8080/')

        //cy.get('#newTask')
        cy.get('input[placeholder="Add a new Task"]')

            .type(taskName)

        // //button[contains(text(), "Create")]
        cy.contains('button', 'Create').click()

        cy.contains('main div p', taskName)
            .should('be.visible')

    })

    it('não deve cadastrar tarefa duplicada', () => {

        const task = {
            name: 'Estudar Javascript',
            is_done: false
        }

        cy.request({
            url: 'http://localhost:3333/helper/tasks',
            method: 'DELETE',
            body: { name: task.name}
        }).then(response => {
            expect(response.status).to.eq(204)
        })

        //dado que eu tenha tarefa duplicada

        cy.request({
            url: 'http://localhost:3333/tasks',
            method: 'POST',
            body: task
        }).then(response => {
            expect(response.status).to.eq(201)
        })

        //Quando faço o cadastro dessa tarefa

        cy.visit('http://localhost:8080/')

        //cy.get('#newTask')
        cy.get('input[placeholder="Add a new Task"]')
            .type(task.name)

        cy.contains('button', 'Create').click()

        //Então vejo mensagem de duplicidade
        cy.get('.swal2-html-container')
            .should('be.visible')
            .should('have.text', 'Task already exists!')
    })
})