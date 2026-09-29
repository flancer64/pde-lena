// @ts-check

/**
 * @namespace Pde_Lena_Cli_Command_DbMigrate
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
            let handedToDatabase = false;
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
                const empty = result.rows?.[0]?.empty === true;
                if (empty) {
                    if (startedConnection) {
                        await connection.disconnect();
                        handedToDatabase = true;
                    }
                    await database.init();
                    try {
                        io.write('Empty Runtime database initialized.\n');
                    } finally {
                        await database.destroy();
                    }
                } else {
                    const migrationResult = await migration.execute();
                    io.write(`Runtime database migration ${migrationResult.status}.\n`);
                }
            } finally {
                if (startedConnection && !handedToDatabase) await connection.disconnect();
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
