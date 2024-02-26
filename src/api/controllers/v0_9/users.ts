import { getAuthorizedContext } from '@controllers/restClient';
import { ApiVersion as API } from '@constants/restApiVersion';
import { UserContext } from '@config/UserContext';
import { User } from '@models/User';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class UsersV09 {
    private static readonly USERS = API.V0_9 + '/users';
    private static readonly USERS_LOGGEDIN = this.USERS + '/loggedin';
    private static readonly USERS_DELETE = this.USERS + '/delete';
    private static readonly USERS_ALLDIRECTORIES = this.USERS + '/allDirectories';
    private static readonly USERS_AD = this.USERS + '/ad';
    private static readonly USERS_RESENDINVITE = this.USERS + '/resendinvite';

    static async getUsersByNameOrId(userNameOrId: string, userContext: UserContext) {
        const apiContext = await getAuthorizedContext(userContext);
        return apiContext.get(`${this.USERS}/${userNameOrId}`);
    }

    static async deleteUsers(ids: string[], userContext: UserContext) {
        const apiContext = await getAuthorizedContext(userContext);
        return apiContext.post(this.USERS_DELETE, { data: ids });
    }

    static async postUsers(
        users: User[],
        userContext: UserContext,
        params?: {
            [key: string]: string | number | boolean;
        },
    ) {
        const apiContext = await getAuthorizedContext(userContext);
        return apiContext.post(this.USERS, {
            data: users,
            params: params,
        });
    }

    static async getUsersLoggedin(
        userContext: UserContext,
        apiContext?: APIRequestContext | undefined,
    ) {
        apiContext = apiContext ?? (await getAuthorizedContext(userContext));
        return apiContext.get(userContext.baseUrl + this.USERS_LOGGEDIN);
    }
}