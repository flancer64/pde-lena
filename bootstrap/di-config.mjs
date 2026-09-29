// @ts-check

/** @namespace Pde_Template_Bootstrap_DiConfig */
export default class Configurator {
    /** @param {TeqFw_Cli_Api_Container_Configurator_Params} params @returns {TeqFw_Cli_Api_Container_Configurator_Configuration} */
    configure(params) {
        const preprocessors = [];
        if (params.argv.includes('db:migrate')) preprocessors.push(function (dependency) {
            if (dependency.moduleName !== 'Pde_Runtime_Cli_Command_DbMigrate') return dependency;
            return Object.freeze({...dependency, moduleName: 'Pde_Template_Cli_Command_DbMigrate'});
        });
        return {preprocessors};
    }
}
