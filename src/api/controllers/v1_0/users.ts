import { ApiVersion as API } from '@constants/restApiVersion';
import { getAuthorizedContext } from '@controllers/restClient';
import { APIRequestContext, APIResponse } from '@playwright/test';
import { UserContext } from '@config/UserContext';
import { UiSettings } from '@models/UiSettings';

export class UsersV1 {
    private static readonly USERS = API.V1_0 + '/users';
    private static readonly USERS_UISETTINGS = UsersV1.USERS + '/uiSettings';
    private static readonly USERS_BULK = this.USERS + '/bulk';

    static async getUsers(userContext: UserContext, options?: object): Promise<APIResponse> {
        const apiContext: APIRequestContext = await getAuthorizedContext(userContext);
        return apiContext.get(this.USERS, options);
    }

    static async patchUiSettings(
        userContext: UserContext,
        uiSettings: UiSettings,
    ): Promise<APIResponse> {
        const apiContext: APIRequestContext = await getAuthorizedContext(userContext);
        return apiContext.patch(this.USERS_UISETTINGS, {
            data: uiSettings,
        });
    }
}