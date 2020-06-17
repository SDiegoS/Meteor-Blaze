/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';

import { Tasks } from './tasks.js';

if (Meteor.isServer) {
    describe('Tasks', () => {
        describe('methods', () => {
            const userId = Random.id();
            let taskId;

            beforeEach(() => {
                Tasks.remove({});
                taskId = Tasks.insert({
                    text: 'test task',
                    createdAt: new Date(),
                    owner: userId,
                    username: 'tmeasday',
                });
            });

            it('can delete owned task', () => {
                // Encontre a implementação interna do método task para que possamos
                // testá-lo isoladamente
                const deleteTask = Meteor.server.method_handlers['tasks.remove'];

                // Configure uma chamada de método falsa que se parece com o que o método espera
                const invocation = { userId };

                // Execute o método com `this` configurado para a invocação falsa
                deleteTask.apply(invocation, [taskId]);

                // Verifique se o método faz o que esperávamos
                assert.equal(Tasks.find({}).count(), 0);
            });
        });
    });
}
