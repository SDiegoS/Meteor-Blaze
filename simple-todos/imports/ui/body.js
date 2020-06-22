import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';
import '../lib/router.js';

import './task.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
    Meteor.subscribe('tasks');
    // const link = window.location.search.split('=');
    // this.videoIdByRouter = new ReactiveVar(link.pop())

});


Template.body.helpers({
    tasks() {
        // Otherwise, return all of the tasks
        return Tasks.find({}, { sort: { createdAt: -1 } });
    },
    incompleteCount() {
        return Tasks.find({ checked: { $ne: true } }).count();
    },
    videoIdByRouter:() => FlowRouter.getQueryParam('videoIdByRouter')
});

Template.body.events({
    'submit .new-task'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const text = target.text.value;

        const tratamento = text.split('/');
        const textForm = tratamento.pop().split('=');

        // Insert a task into the collection
        Meteor.call('tasks.insert', text, textForm.pop());

        // Clear form
        target.text.value = '';
    },
    'submit .changeVideo'(event,template){
        event.preventDefault()

        FlowRouter.setQueryParams({videoIdByRouter: event.target.video.value})
    },

    'click #home'(event){
        event.preventDefault()
        FlowRouter.go('/')
    }
});
