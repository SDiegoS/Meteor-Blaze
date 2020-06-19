import { Template } from 'meteor/templating';

import './task.html';
import './video.js';


Template.task.onCreated(function taskOnCreated() {
    this.checkVideo = new ReactiveVar(false);
    Meteor.subscribe('video');
});

Template.task.helpers({
    isOwner() {
        return this.owner === Meteor.userId();
    },
    checkVideo() {
        return Template.instance().checkVideo.get();
    },
});

Template.task.events({
    'click .assistir':(event, template) => template.checkVideo.set(!template.checkVideo.get()),
    'click .delete'() {
        Meteor.call('tasks.remove', this._id);
    },
    'click .toggle-private'() {
        Meteor.call('tasks.setPrivate', this._id, !this.private);
    },
});
