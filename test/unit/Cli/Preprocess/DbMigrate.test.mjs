import assert from 'node:assert/strict';
import test from 'node:test';
import DbMigrate from '../../../../src/Cli/Preprocess/DbMigrate.mjs';
import Configurator from '../../../../bootstrap/di-config.mjs';

test('selects the host migration command for db:migrate only', () => {
    const configurator = new Configurator();
    assert.deepEqual(configurator.configure({argv: ['db:migrate']}).container.preprocessors,
        ['Pde_Lena_Cli_Preprocess_DbMigrate$']);
    assert.deepEqual(configurator.configure({argv: ['web:start']}).container.preprocessors, []);

    const preprocess = DbMigrate();
    const runtime = {addressKind: 'teq', address: 'Pde_Runtime_Cli_Command_DbMigrate', lifestyle: 'singleton'};
    assert.deepEqual(preprocess(runtime), {...runtime, address: 'Pde_Lena_Cli_Command_DbMigrate'});
    const unrelated = {address: 'Pde_Runtime_Cli_Plugin'};
    assert.equal(preprocess(unrelated), unrelated);
});
