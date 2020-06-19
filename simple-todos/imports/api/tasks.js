import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');
export const Hists = new Mongo.Collection('hists');

if (Meteor.isServer) {
    // Este código é executado apenas no servidor
    // Publica apenas tarefas que são públicas ou pertencem ao usuário atual
    Meteor.publish('tasks', function tasksPublication() {
        return Tasks.find({
            $or: [
                {private: {$ne: true}},
                {owner: this.userId},
            ],
        });
    });
    Meteor.publish('hists', function HistPublication() {
        return Hists.find({
            $or: [
                {private: {$ne: true}},
                {owner: this.userId},
            ],
        });
    });
}

Meteor.methods({
    'tasks.insert'(text, description) {
        check(text, String);
        check(description, String);

        // Verifique se o usuário está conectado antes de inserir uma tarefak
        if (! this.userId) {
            throw new Meteor.Error('not-authorized');
        }else {
            Tasks.insert({
                text,
                description,
                private: true,
                createdAt: new Date(),
                owner: this.userId,
                username: Meteor.users.findOne(this.userId).username,
            });
        };

    },
    'hists.setHist'(hist){
        check(hist, Object);
        check(hist.id_task, String);
        // check(hist.histTime, Date);
        check(hist.desc, String);
        check(hist.user_name, String);

        const task = Tasks.findOne({_id: hist.id_task});
        if(task){
            if (task.private && task.owner !== this.userId) {
                // Se a tarefa for privada, verifique se apenas o proprietário pode altera-la
                throw new Meteor.Error('not-authorized');
            }
            //Adiciona Historico
            Hists.insert(hist);
        };
    },
    'tasks.setUpdate'(update){
        check(update, Object);
        check(update._id, String);
        check(update.$set, Object);

        let msgHist;

        if(update.$set.text && update.$set.description) {
            msgHist = "Alterado Titulo e Descrição!"
        }else if(update.$set.text) {
            msgHist = "Alterado Titulo!"
        }else if(update.$set.description){
            msgHist = "Alterado Descrição!"
        }

        const task = Tasks.findOne({_id: update._id});
        if(task){
            if (task.private && task.owner !== this.userId) {
                // Se a tarefa for privada, verifique se apenas o proprietário pode altera-la
                throw new Meteor.Error('not-authorized');
            }
            if(Tasks.update({_id: update._id}, { $set:  update.$set})){
                const hist = {
                    id_task: update._id,
                    histTime: new Date(),
                    desc: msgHist,
                    acao: "Update",
                    user_name: Meteor.users.findOne(this.userId).username
                }
                Meteor.call('hists.setHist', hist)
            };
        };
    },
    'tasks.remove'(taskId) {
        check(taskId, String);

        const task = Tasks.findOne(taskId);
        if (task.private && task.owner !== this.userId) {
            // Se a tarefa for privada, verifique se apenas o proprietário pode excluí-la
            throw new Meteor.Error('not-authorized');
        }
            Tasks.remove(taskId);


    },
    'tasks.removeHist'(taskId) {
        check(taskId, String);

        const task = Tasks.findOne(taskId);
        if (task.private && task.owner !== this.userId) {
            // Se a tarefa for privada, verifique se apenas o proprietário pode excluí-la
            throw new Meteor.Error('not-authorized');
        }
            Hists.remove({id_task: taskId });

    },
    'tasks.delete-all-checked'(){
        let tarefasConcluidas = Tasks.find({ checked: true}, {fields: {_id: 1}}).fetch();
        if (tarefasConcluidas.length) {
            tarefasConcluidas.forEach(task => Meteor.call('tasks.remove', task._id));
        };

    },
    'tasks.setChecked'(taskId, setChecked) {
        check(taskId, String);
        check(setChecked, Boolean);

        const task = Tasks.findOne(taskId);
        if (task.private && task.owner !== this.userId) {
            // Se a tarefa for privada, verifique se apenas o proprietário pode excluí-la
            throw new Meteor.Error('not-authorized');
        }
            if(Tasks.update(taskId, { $set: { checked: setChecked } })){
                if(setChecked){
                    const hist = {
                        id_task: task._id,
                        histTime: new Date(),
                        desc: 'Checado',
                        acao: 'Checagem',
                        user_name: Meteor.users.findOne(this.userId).username
                    };
                        Meteor.call('hists.setHist', hist);
                } else{
                    const hist = {
                        id_task: task._id,
                        histTime: new Date(),
                        desc: 'Deschecado',
                        acao: 'Deschecagem',
                        user_name: Meteor.users.findOne(this.userId).username
                    };
                        Meteor.call('hists.setHist', hist);
                }
            };


    },
    'tasks.setPrivate'(taskId, setToPrivate){
        check(taskId, String);
        check(setToPrivate, Boolean);

        const task = Tasks.findOne(taskId);

        // Verifique se apenas o proprietário da tarefa pode tornar uma tarefa privada
        if (task.owner !== this.userId) {
            throw new Meteor.Error('not-authorized');
        }
            Tasks.update(taskId, {$set: {private: setToPrivate}});

    }
});
