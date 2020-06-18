import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';


import './task.html';
import {ReactiveDict} from "meteor/reactive-dict";

Template.task.onCreated(function bodyOnCreated() {
    this.upd = new ReactiveVar(false);
});

Template.task.helpers({
    isOwner() {
        return this.Owner === Meteor.userId();
    },
    upd() {
       return Template.instance().upd.get()
    }
});

Template.task.events({
    'click .toggle-checked'() {
        // Defina a propriedade marcada para o oposto do seu valor atual
        Meteor.call('tasks.setChecked', this._id, !this.checked);
    },
    'click .upd'(){
        let upd = Template.instance().upd.get();

        if (upd){
            const update = {
                _id: this._id,
                $set: {
                    text: $('#edit').val(),
                    description: $('#editDesc').val()
                }
            };
            Meteor.call('tasks.setUpdate', update);
        }

        upd = upd ? Template.instance().upd.set(false) : Template.instance().upd.set(true);
    },
    'click .delete'() {
        Meteor.call('tasks.remove', this._id);
    },
    'click .toggle-private'(){
        Meteor.call('tasks.setPrivate', this._id, !this.private);
    },
});
