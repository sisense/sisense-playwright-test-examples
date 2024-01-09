import { APIRequestContext, APIResponse } from '@playwright/test';
import { ApiVersion as API } from '@constants/restApiVersion';
import { v4 as uuidv4 } from 'uuid';
import { UserContext } from '@config/UserContext';
import { getAuthorizedContext } from '@controllers/restClient';

export class AuthenticationV1 {
    private static readonly AUTHENTICATION = API.V1_0 + '/authentication';
    private static readonly AUTHENTICATION_LOGIN = this.AUTHENTICATION + '/login';

    static async postLogin(
        apiContext: APIRequestContext,
        userContext: UserContext,
    ): Promise<APIResponse> {
        return apiContext.post(this.AUTHENTICATION_LOGIN, {
            form: {
                username: userContext.email,
                password: userContext.password,
            },
        });
    }

    static async postLoginViaUI(
        apiContext: APIRequestContext,
        userContext: UserContext,
    ): Promise<APIResponse> {
        let uuid = uuidv4();
        return apiContext.post(userContext.baseUrl + this.AUTHENTICATION_LOGIN, {
            data: {
                username: userContext.email,
                password: userContext.password,
            },
            headers: {
                ['X-Device-Id']: uuid,
            },
        });
    }

    static async getCurrentUserApiToken(userContext: UserContext): Promise<APIResponse> {
        const apiContext: APIRequestContext = await getAuthorizedContext(userContext);
        return apiContext.get(`${this.AUTHENTICATION}/tokens/api`);
    }
}
