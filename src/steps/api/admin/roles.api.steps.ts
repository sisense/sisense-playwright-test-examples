import { RoleDisplayName } from '@constants/roleDisplayName';
import { UserContext } from '@config/UserContext';
import test, { APIResponse, expect } from '@playwright/test';
import { RolesV09 } from '@controllers/v0_9/roles';

export class RolesAPISteps {
    /**
     * Gets id of a User Role by role name
     * @param displayName - user role name in UI
     * @param userContext - user that makes the API call
     * @returns id of the User Role
     */
    static async getRoleIdByName(
        displayName: RoleDisplayName,
        userContext: UserContext,
    ): Promise<string> {
        return test.step(`Get id of '${displayName}' role by '${userContext.email}' via API`, async () => {
            const role: Role = await this.getRoleByDisplayName(userContext, displayName);
            return role._id;
        });
    }

    /**
     * Gets role object by its display name
     * @param userContext   - user that makes the API call
     * @param displayName   - user role name in UI
     * @private
     */
    private static async getRoleByDisplayName(
        userContext: UserContext,
        displayName: RoleDisplayName,
    ): Promise<Role> {
        return test.step(`Get user role for '${displayName}' by '${userContext.email}' via API`, async () => {
            const roles: Role[] = await this.getAllRoles(userContext);
            const role: Role | undefined = roles.find((rol) => rol.displayName === displayName);
            if (!role) throw new Error('Role not found: ' + displayName);
            return role;
        });
    }

    /**
     * Gets all user roles
     * @param userContext - [user]{@link UserContext} that makes the API call
     * @private
     * @returns body response in json
     */
    private static async getAllRoles(userContext: UserContext): Promise<Role[]> {
        return test.step(`Get all roles by '${userContext.email}' via API`, async () => {
            const response = await RolesV09.getRoles(userContext);
            expect(response.status()).toBe(200);
            return response.json();
        });
    }
}