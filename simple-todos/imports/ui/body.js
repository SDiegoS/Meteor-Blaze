import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';

import './task.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
    Meteor.subscribe('tasks');

    this.videoIdByRouter = new ReactiveVar(false)
    console.log(this)
});

Template.body.helpers({
    tasks() {
        // Otherwise, return all of the tasks
        return Tasks.find({}, { sort: { createdAt: -1 } });
    },
    incompleteCount() {
        return Tasks.find({ checked: { $ne: true } }).count();
    },
    videoIdByRouter:() => Template.instance().videoIdByRouter.get()
});

Template.body.events({
    'submit .new-task'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const text = target.text.value;

        const tratamento = text.split('/');
        const textForm = tratamento[tratamento.length-1].split('=');

        // Insert a task into the collection
        Meteor.call('tasks.insert', text, textForm[textForm.length-1]);

        // Clear form
        target.text.value = '';
    },

});
