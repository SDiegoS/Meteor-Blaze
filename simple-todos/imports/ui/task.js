import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';


import './task.html';

Template.task.events({
    'click .toggle-checked'() {
        // Defina a propriedade marcada para o oposto do seu valor atual
        Meteor.call('tasks.setChecked', this._id, !this.checked);
    },
    'click .delete'() {
        Meteor.call('tasks.remove', this._id);
    },
});
