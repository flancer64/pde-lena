import assert from 'node:assert/strict';
import test from 'node:test';
import Plugin from '../../../src/Cli/Plugin.mjs';

test('applies the host logging policy at startup', async () => {
    const roots = [];
    const plugin = Plugin({
        cliConfig: {applicationRoot: '/host/lena'},
        policy: {apply: async ({appRoot}) => roots.push(appRoot)},
    });
    await plugin.onStartup();
    await plugin.onShutdown();
    assert.deepEqual(roots, ['/host/lena']);
});
