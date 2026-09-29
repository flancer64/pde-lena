import assert from 'node:assert/strict';
import test from 'node:test';
import DbMigrate from '../../../../src/Cli/Command/DbMigrate.mjs';

function harness(empty) {
    const calls = [];
    let client;
    const connection = {
        getClient: () => client,
        init: async () => { calls.push('connect'); client = {raw: async () => ({rows: [{empty}]})}; },
        disconnect: async () => { calls.push('disconnect'); client = undefined; },
        getDialectAdapter: () => ({describe: async () => ({id: 'postgresql'})}),
    };
    const database = {
        init: async () => { calls.push('database.init'); },
        destroy: async () => { calls.push('database.destroy'); },
    };
    const migration = {
        execute: async () => {
            assert.ok(client, 'migration must retain the inspected connection');
            calls.push('migration.execute');
            return {status: 'up-to-date'};
        },
    };
    const io = {write: (value) => calls.push(value.trim())};
    return {command: DbMigrate({config: {get: () => ({})}, connection, database, migration, io}), calls};
}

test('initializes an empty database through Runtime Database', async () => {
    const {command, calls} = harness(true);
    await command.execute();
    assert.deepEqual(calls, [
        'connect', 'disconnect', 'database.init',
        'Empty Runtime database initialized.', 'database.destroy',
    ]);
});

test('passes an existing database to Runtime migration before disconnecting', async () => {
    const {command, calls} = harness(false);
    await command.execute();
    assert.deepEqual(calls, [
        'connect', 'migration.execute', 'Runtime database migration up-to-date.', 'disconnect',
    ]);
});
