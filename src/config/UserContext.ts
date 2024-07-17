import { envConfig } from '@config/env.config';
import { RoleDisplayName } from '@constants/roleDisplayName';
import { generateUserPassword } from '@utils/stringUtils';

export class UserContext {
    readonly email: string;
    readonly roleName: RoleDisplayName;
    readonly tenantName: string;
    password: string;
    baseUrl: string;
    token?: string;
    userName?: string;

    constructor(
        email: string,
        roleName: RoleDisplayName,
        tenantName: string = envConfig.systemTenant,
        password: string = generateUserPassword(),
        userName: string = email,
    ) {
        this.email = email;
        this.roleName = roleName;
        this.tenantName = tenantName;
        this.password = password;
        this.baseUrl = getBaseUrl(this);
        this.userName = userName;
        console.log('Created user context:', this);
    }
}

/**
 * Gets BaseURL based on the provided user
 * @returns baseURL for current user (with or without tenant suffix/prefix)
 */
const getBaseUrl = function (userContext: UserContext) {
    if (userContext.tenantName === envConfig.systemTenant) {
        return `${envConfig.getClientUrl()}/`;
    } else {
        return `${envConfig.getClientUrl()}/${userContext.tenantName}/`;
    }
};

/**
 * Initialization of Default User Context which is used to start running tests
 * Do not use it in tests. This is the same as userContext which is used for start running tests
 */
export const defaultUserContext = new UserContext(
    envConfig.userEmail,
    RoleDisplayName.SYS_ADMIN,
    envConfig.systemTenant,
    envConfig.userPassword,
);