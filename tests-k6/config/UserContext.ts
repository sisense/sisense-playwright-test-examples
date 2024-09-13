import { envConfig } from "../../src/config/env.config";
import { RoleDisplayName } from "../../src/constants/roleDisplayName";

export class UserContext {
    readonly email: string;
    readonly roleName: RoleDisplayName;
    readonly tenantName: string;
    readonly password: string;
    readonly baseUrl: string;
    token?: string;

    constructor(email: string, roleName: RoleDisplayName, tenantName: string, password?: string) {
        this.email = email;
        this.roleName = roleName;
        this.tenantName = tenantName;
        this.password = password ?? envConfig.defaultPassword;
        this.baseUrl = getBaseUrl(this);
        console.log(this);
    }
}

/**
 * Gets BaseURL based on the provided user
 * @returns baseURL for current user (with or without tenant suffix/prefix)
 */
const getBaseUrl = function (userContext: UserContext) {
    return `${envConfig.getClientUrl()}/${userContext.tenantName !== envConfig.systemTenant ? userContext.tenantName + '/' : ''
        }`;
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