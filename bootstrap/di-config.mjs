// @ts-check

/** @namespace Pde_Lena_Bootstrap_DiConfig */
export default class Configurator {
    /** @param {TeqFw_Cli_Api_Container_Configurator_Params} params @returns {TeqFw_Cli_Api_Container_Configurator_Configuration} */
    configure(params) {
        const preprocessors = params.argv.includes('db:migrate')
            ? ['Pde_Lena_Cli_Preprocess_DbMigrate$']
            : [];
        return {container: {preprocessors}};
    }
}
