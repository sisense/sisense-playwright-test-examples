import { APIRequestContext, APIResponse } from '@playwright/test';
import { ApiVersion as API } from '@constants/restApiVersion';
import { UserContext } from '@config/UserContext';
import { getAuthorizedContext } from '@controllers/restClient';

export class AuthV09 {
    private static readonly AUTH = API.V0_9 + '/auth';
    private static readonly LOGOUT = this.AUTH + '/logout';

    static async getLogout(
        apiContext: APIRequestContext,
        userContext: UserContext,
    ): Promise<APIResponse> {
        const XSRF_TOKEN = (await apiContext.storageState()).cookies.find(
            (cookie) => cookie.name == 'XSRF-TOKEN',
        )?.value;
        const header = XSRF_TOKEN ? { headers: { ['X-XSRF-TOKEN']: XSRF_TOKEN } } : {};
        return apiContext.get(userContext.baseUrl + this.LOGOUT, header);
    }

    static async getIsAuth(userContext: UserContext): Promise<APIResponse> {
        const apiContext: APIRequestContext = await getAuthorizedContext(userContext);
        return apiContext.get(`${this.AUTH}/isauth`);
    }
}
