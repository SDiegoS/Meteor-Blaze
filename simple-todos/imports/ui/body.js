import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';

import  './task.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    Meteor.subscribe('tasks');
});

Template.body.helpers({
    tasks() {
        const instance = Template.instance();
        if (instance.state.get('hideCompleted')) {
            // Se ocultar concluído estiver marcado, filtre as tarefas
            return Tasks.find({ checked: {$ne: true}}, { sort: {createdAt: -1}});
        }

        return Tasks.find({}, {
            // Caso contrário, retorne todas as tarefas
            sort: {createdAt: -1}
        });
    },
    incompleteCount() {
        return Tasks.find({ checked: {$ne: true}}).count();
    },
});

Template.body.events({
    'submit .new-task'(event) {
        //Impedir o envio do formulário padrão do navegador
        event.preventDefault();

        // Obter valor do elemento do formulário
        const target = event.target;
        const text = target.text.value;
        const description = target.description.value;

        Meteor.call('tasks.insert', text, description);

        // Forma limpa
        target.text.value = '';
        target.description.value = '';
    },
    'change .hide-completed input'(event, instance) {
        instance.state.set('hideCompleted', event.target.checked);
    },
})
