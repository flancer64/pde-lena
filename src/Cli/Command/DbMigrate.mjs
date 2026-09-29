// @ts-check

/**
 * @namespace Pde_Template_Cli_Command_DbMigrate
 * @description Initializes an empty PostgreSQL database or runs the Runtime migration.
 */

/**
 * @param {object} deps
 * @param {TeqFw_Db_Back_Config} deps.config
 * @param {TeqFw_Db_Back_RDb_Connect} deps.connection
 * @param {Pde_Runtime_Storage_Database} deps.database
 * @param {Pde_Runtime_Storage_Migration} deps.migration
 * @param {TeqFw_Cli_Adapter_Io} deps.io
 * @returns {TeqFw_Cli_Dto_Command}
 */
export default function DbMigrate({config, connection, database, migration, io}) {
    return Object.freeze({
        id: 'db:migrate',
        summary: 'Initialize a clean database or migrate a recognized Runtime predecessor.',
        lifetime: 'finite',
        execute: async function () {
            const startedConnection = !connection.getClient();
            if (startedConnection) await connection.init(config.get());
            let empty;
            try {
                const adapter = await connection.getDialectAdapter().describe();
                if (adapter.id !== 'postgresql') throw new Error('This host migration command expects PostgreSQL.');
                const result = await connection.getClient().raw(`
                    SELECT NOT EXISTS (
                        SELECT 1 FROM pg_class AS object
                        JOIN pg_namespace AS schema ON schema.oid = object.relnamespace
                        WHERE schema.nspname = 'public' AND object.relkind IN ('r', 'p', 'v', 'm', 'f', 'S')
                    ) AS empty
                `);
                empty = result.rows?.[0]?.empty === true;
            } finally {
                if (startedConnection) await connection.disconnect();
            }
            if (empty) {
                await database.init();
                await database.destroy();
                io.write('Empty Runtime database initialized.\n');
            } else {
                const result = await migration.execute();
                io.write(`Runtime database migration ${result.status}.\n`);
            }
        },
    });
}

export const __deps__ = Object.freeze({default: Object.freeze({
    config: 'TeqFw_Db_Back_Config$',
    connection: 'TeqFw_Db_Back_RDb_Connect$',
    database: 'Pde_Runtime_Storage_Database$',
    migration: 'Pde_Runtime_Storage_Migration$',
    io: 'TeqFw_Cli_Adapter_Io$',
})});
