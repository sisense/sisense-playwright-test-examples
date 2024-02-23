import test, { expect, Page } from '@playwright/test';
import { UserContext } from '@config/UserContext';
import { AuthenticationV1 } from '@controllers/v1_0/authentication';
import { User } from '@models/User';
import { UsersV09 } from '@controllers/v0_9/users';
import { UsersV1 } from '@controllers/v1_0/users';
import { RoleDisplayName } from '@constants/roleDisplayName';
import { envConfig } from '@config/env.config';
import { RolesAPISteps } from '@steps/api/admin/roles.api.steps';
import { LanguageCodeName } from '@constants/languageCodeName';
import { TenantsAPISteps } from '@steps/api/admin/tenants.api.steps';

export class UsersAPISteps {

    /**
   * Logs in the user via API into a browser context
   * @param page - [browser context]{@link page.context} with the current page
   * @param userContext - user that makes the API call
   */
    static async userLogIn(page: Page, userContext: UserContext): Promise<void> {
        await test.step(`User '${userContext.email}' logged in via API`, async () => {
            await page.context().clearCookies();
            const res = await AuthenticationV1.postLoginViaUI(page.request, userContext);
            expect(res.status()).toBe(200);
        });
    }

    /**
     * Gets user id by name
     * @param userName - user name
     * @param userContext - user that makes the API call
     * @returns [user]{@link User} object
     */
    static async getUserIdByName(userName: string, userContext: UserContext): Promise<string> {
        return test.step(`Get '${userName}' user Id by '${userContext.email}' via API`, async () => {
            const res: User = await this.getUserByUsernameOrId(userName, userContext);
            return res._id!;
        });
    }

    /**
     * Gets user by id or name
     * @param userNameOrId - user id or name
     * @param userContext - user that makes the API call
     * @returns [user]{@link User} object
     */
    static async getUserByUsernameOrId(
        userNameOrId: string,
        userContext: UserContext,
    ): Promise<User> {
        return test.step(`Get '${userNameOrId}' user by '${userContext.email}' via API`, async () => {
            const res = await UsersV09.getUsersByNameOrId(userNameOrId, userContext);
            expect(res.status()).toBe(200);
            return res.json();
        });
    }

    /**
     * Deletes users by UserContext
     * @param users - users objects to take users emails
     * @param userContext - user that makes the API call
     */
    static async deleteUsers(users: UserContext[], userContext: UserContext): Promise<void> {
        const emails = users.map((user) => user.email);
        await test.step(`Delete '${emails}' user by '${userContext.email}' via API`, async (): Promise<void> => {
            for (const email of emails) {
                const existingUsers: User[] = await this.getUsersByEmail(email, userContext);
                const ids: string[] = existingUsers
                    .filter((user) => {
                        return email === user.email;
                    })
                    .map((user) => user._id!);
                if (ids.length !== 0) {
                    try {
                        const response = await UsersV09.deleteUsers(ids, userContext);
                        expect(response.status()).toBe(200);
                        console.log('User deleted: ' + email);
                    } catch (error) {
                        console.error('Failed to delete user:', error);
                    }
                } else {
                    console.log('There are no users to delete');
                }
            }
        });
    }

    /**
     * Add new user to the system via API V09
     * @param user              - user that should be added
     * @param userContext       - user that makes the API call
     * @param isWithoutPassword - optional; pass 'true' to create a user with no password
     * @returns added user's context with next fields:
     * <br>email
     * <br>roleName
     * <br>tenantName
     * <br>password
     * <br>baseUrl
     * <br>token
     * <br>userName
     */
    static async addUser(
        user: User,
        userContext: UserContext,
        isWithoutPassword?: boolean,
    ): Promise<UserContext> {
        return test.step(`Add '${user.email}' user by '${userContext.email}' via API`, async () => {
            const { newUser, context, params } = await this.createUserObject(
                userContext,
                user,
                isWithoutPassword,
            );
            await this.addUsers([newUser], userContext, params);
            return context;
        });
    }

    /**
     * Add new users to the system via API V09
     * @param users - users that should be added
     * @param userContext - user that makes the API call
     * @param params - request params
     * @private
     * @returns created users objects
     */
    private static async addUsers(
        users: User[],
        userContext: UserContext,
        params?: {
            [key: string]: string | number | boolean;
        },
    ): Promise<User[]> {
        const usersEmail: string[] = users.map((user) => user.email);
        return test.step(`Add users '${usersEmail}' via API`, async () => {
            const response = await UsersV09.postUsers(users, userContext, params);
            expect(response.status()).toBe(200);
            console.log('Users added: ' + usersEmail);
            return users;
        });
    }

    /**
     * Gets users by email partial match
     * @param email       - user email
     * @param userContext - user that makes the API call
     * @returns body response in json
     */
    private static async getUsersByEmail(email: string, userContext: UserContext): Promise<User[]> {
        return test.step(`Get users by '${userContext.email}' email via API`, async () => {
            const response = await UsersV1.getUsers(userContext, { params: { [`email`]: email } });
            expect(response.status()).toBe(200);
            return response.json();
        });
    }

    private static async createUserObject(
        userContext: UserContext,
        user: User,
        isWithoutPassword?: boolean,
    ): Promise<{
        newUser: User;
        context: UserContext;
        params: { [p: string]: string | number | boolean } | undefined;
    }> {
        let roleName: RoleDisplayName | undefined = user.roleName;
        if (!roleName) throw new Error(`Role name must be define. 'user.roleName'='${roleName}'`);

        // Use tenant defined OR the same tenant as in user context OR default 'system'
        let tenantName: string =
            user.tenant?.name ?? userContext.tenantName ?? envConfig.systemTenant;

        // Use tenant admin role if add admin user in custom tenant
        if (tenantName !== envConfig.systemTenant && roleName === RoleDisplayName.ADMIN) {
            roleName = RoleDisplayName.TENANT_ADMIN;
            console.log(
                'Admin user will be created with tenant admin role because it is in custom tenant',
            );
        }

        const roleId = await RolesAPISteps.getRoleIdByName(roleName, userContext);

        const allowed = this.isCrossTenantAllowed(user);

        let newUser: User = {
            email: user.email,
            firstName: user.firstName ?? '',
            lastName: user.lastName ?? '',
            groups: [],
            roleId,
            manifest: { tenants: { crossTenant: { allowed } } },
            preferences: {
                language: user.preferences?.language ?? LanguageCodeName.SYSTEM_LANGUAGE,
            },
            userName: user.userName || user.email,
        };

        // tenantId parameter is used only for adding user by system tenant user
        if (tenantName === envConfig.systemTenant) {
            newUser.tenantId = await TenantsAPISteps.getTenantIdByName(tenantName, userContext);
        }
        let params;
        // isWithoutPassword using for manage password generation behaviour
        if (isWithoutPassword) {
            console.log(`${user.email} user will be created without password`);
            params = { notify: true };
        } else {
            console.log(`${user.email} user will be created with password`);
            newUser.password = user.password ?? envConfig.defaultPassword;
        }
        const context: UserContext = new UserContext(
            newUser.email,
            roleName,
            tenantName,
            newUser.password,
            newUser.userName,
        );
        return { newUser, context, params };
    }

    /**
     * Checks is cross tenant allowed for user by its Role Name
     * @param user - user that makes the API call
     * @private
     * @returns isCrossTenantAllowed (boolean)
     */
    private static isCrossTenantAllowed(user: User) {
        const allowedRoleNames = new Set([
            RoleDisplayName.ADMIN,
            RoleDisplayName.DATA_ADMIN,
            RoleDisplayName.SYS_ADMIN,
        ]);

        return allowedRoleNames.has(user.roleName!);
    }

}