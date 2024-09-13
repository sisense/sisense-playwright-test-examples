import http from 'k6/http';
import { checkResponse } from './verification.steps';
import { RoleDisplayName } from '../../src/constants/roleDisplayName';
import { RoleName } from '../../src/constants/roleName';
import { getParamsWithToken } from './login.steps';
import { UserContext } from '../config/UserContext';

function getRoles(userContext: UserContext) {
    const params = getParamsWithToken(userContext);
    const getRolesResp = http.get(userContext.baseUrl + 'api/roles', params);
    checkResponse(getRolesResp, 200, 'Get all roles');
    return getRolesResp;
}

export function getRoleId(userContext: UserContext, roleDisplayName: RoleDisplayName) {
    const getRolesResp = getRoles(userContext);
    const roleId = getRolesResp.json(`#(displayName=="${roleDisplayName}")._id`)!.toString();
    console.log(`Role: '${roleDisplayName}' with id: '${roleId}'`);
    return roleId;
}

/**
 * Gets role ID by roleName
 * @param userContext - user that makes the API call
 * @param roleName    - role name
 * returns role ID for specified role name
 */
export function getRoleIdByRoleName(userContext: UserContext, roleName: RoleName): string {
    const getRolesResp = getRoles(userContext);
    const roleId = getRolesResp.json(`#(name=="${roleName}")._id`)!.toString();
    console.log(`Role '${roleName}' id: '${roleId}'`);
    return roleId;
}
