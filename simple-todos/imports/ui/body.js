import { Template } from 'meteor/templating';

import { Tasks } from '../api/tasks.js';

import  './task.js';
import './body.html';

Template.body.helpers({
    tasks() {
        return Tasks.find({}, {
            // Mostra as tarefas mais recentes na parte superior
            sort: {createdAt: -1}
        });
    },
});

Template.body.events({
    'submit .new-task'(event) {
        console.log(event);
        //Impedir o envio do formulário padrão do navegador
        event.preventDefault();

        // Obter valor do elemento do formulário
        const target = event.target;
        const text = target.text.value;

        // Insere uma tarefa na coleção
        Tasks.insert({
            text,
            createdAt: new Date(),
        });

        // Forma limpa
        target.text.value = '';
    },
})
