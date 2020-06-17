import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';


import './task.html';

Template.task.helpers({
    isOwner() {
        return this.Owner === Meteor.userId();
    },
});

Template.task.events({
    'click .toggle-checked'() {
        // Defina a propriedade marcada para o oposto do seu valor atual
        Meteor.call('tasks.setChecked', this._id, !this.checked);
    },
    'click .delete'() {
        Meteor.call('tasks.remove', this._id);
    },
    'click .toggle-private'(){
        Meteor.call('tasks.setPrivate', this._id, !this.private);
    },
});
