// @ts-check

/**
 * @namespace Pde_Lena_Cli_Preprocess_DbMigrate
 * @description Substitutes the host's clean-database migration wrapper.
 */

/** @returns {(dependency: TeqFw_Di_Dto_DepId) => TeqFw_Di_Dto_DepId} */
export default function DbMigrate() {
    return function (dependency) {
        if (dependency.address !== 'Pde_Runtime_Cli_Command_DbMigrate') return dependency;
        return {...dependency, address: 'Pde_Lena_Cli_Command_DbMigrate'};
    };
}
