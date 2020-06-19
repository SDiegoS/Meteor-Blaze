import './historico.html';
import { Template } from 'meteor/templating';
import {Hists} from "../api/tasks";

Template.historico.helpers({

    horario(){
        const idTask = Template.instance().data._id;
        const data =  Hists.findOne({ _id: idTask}).histTime;

        return `${data.getDate()}/${data.getMonth()+1}/${data.getFullYear()}  ${data.getHours()}:${data.getMinutes()}`;

    }
});
