import { Template } from 'meteor/templating';

import { Tasks } from '../api/tasks.js';

import './task.html';

Template.task.events({
    'click .toggle-checked'() {
        // Defina a propriedade marcada para o oposto do seu valor atual
        Tasks.update(this._id, {
            $set: { checked: !this.checked },
        });
    },
    'click .delete'() {
        Tasks.remove(this._id);
    },
});
