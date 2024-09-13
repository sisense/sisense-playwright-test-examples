import http from 'k6/http';
import { checkResponse } from './verification.steps';
import { RoleDisplayName } from '../../src/constants/roleDisplayName';
import { UserContext } from '../config/UserContext';

/**
 * Authenticates user
 * @param userContext - user that makes the API call
 * returns userContext with authentication token
 */
export function login(userContext: UserContext): UserContext {
    userContext.token = postLogin(userContext).json('access_token')!.toString();
    return userContext;
}

function postLogin(userContext: UserContext) {
    const body = JSON.stringify({
        username: userContext.email,
        password: userContext.password,
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const loginResp = http.post(userContext.baseUrl + 'api/v1/authentication/login', body, params);
    checkResponse(loginResp, 200, `Login as a '${userContext.email}' user`);
    return loginResp;
}

export function getParamsWithToken(userContext: UserContext) {
    return {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + userContext.token,
        },
    };
}

export function loginUsersByEmailOnTenant(
    userEmails: string[],
    tenant: string,
    role: RoleDisplayName = RoleDisplayName.VIEWER,
): UserContext[] {
    let tenantUsers: UserContext[] = [];

    for (const userEmail of userEmails) {
        let viewer: UserContext = new UserContext(userEmail, role, tenant);
        viewer = login(viewer);
        tenantUsers.push(viewer);
    }
    console.log(`Returning tenantUsers '${tenantUsers.length}' on tenant: ${tenant}`);
    return tenantUsers;
}
