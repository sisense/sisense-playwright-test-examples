import { UserContext } from '@config/UserContext';
import { envConfig } from '@config/env.config';
import { RoleDisplayName } from '@constants/roleDisplayName';
import * as process from 'process';
import { v4 as uuid_v4 } from 'uuid';

let uuid = uuid_v4();
export const getGlobalUUID = (): string => {
    return uuid;
};

const suffix: string = '_' + getGlobalUUID().slice(-8);

const getNewTenantName = (): string => `tenant${envConfig.isStandardCloud ? suffix : ''}`;

export const getTenantAdminUserContext = (): UserContext => {
    if (envConfig.createCustomTenant) {
        process.env.NEW_TENANT_NAME ??= getNewTenantName();

        return new UserContext(
            process.env.NEW_TENANT_NAME + '@sisense.com',
            RoleDisplayName.TENANT_ADMIN,
            process.env.NEW_TENANT_NAME,
            envConfig.defaultPassword,
        );
    } else {
        throw new Error('Tests are running against directly setting up custom tenant.');
    }
};

/**
 * Fails if method/function executed within Standard Cloud env
 * @param options - possible options to extends functionality:
 *   message - custom message to display instead of default
 *   condition - additional condition to fail
 */
export const failIfStandardCloud = (options: { message?: string; condition?: boolean }): void => {
    if (envConfig.isStandardCloud && (options.condition ?? true)) {
        throw new Error(
            `Error on SKU env: ${
                options.message ?? 'Method/function is not allowed to execute on Standard Cloud env'
            }`,
        );
    }
};
