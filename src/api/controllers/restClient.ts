import { APIRequestContext, APIResponse, Cookie, expect, request } from '@playwright/test';
import { AuthenticationV1 } from './v1_0/authentication';
import { UserContext } from '@config/UserContext';

// Creates initial context based on URL
export const getInitContext = async (baseURL: string) => {
    return request.newContext({
        baseURL,
    });
};

// Gets and saves access token in user context
const getAccessToken = async (userContext: UserContext) => {
    const initContext: APIRequestContext = await getInitContext(userContext.baseUrl);
    const res: APIResponse = await AuthenticationV1.postLogin(initContext, userContext);

    expect(res.status()).toBe(200);
    const { access_token, success } = await res.json();

    expect(success).toBe(true);

    console.log(`Authorized by '${userContext.email}' with new access_token`);
    // Saves token for user context
    userContext.token = access_token;
    return access_token;
};

// Gets authorized user context further usage in REST API calls
export const getAuthorizedContext = async (
    userContext: UserContext,
    extraHeaders?: { [header: string]: string },
): Promise<APIRequestContext> => {
    const accessToken = userContext.token ?? (await getAccessToken(userContext));
    let extraHTTPHeaders: { Authorization: string } = {
        Authorization: `Bearer ${accessToken}`,
    };
    if (extraHeaders) extraHTTPHeaders = { ...extraHTTPHeaders, ...extraHeaders };

    return request.newContext({
        baseURL: userContext.baseUrl,
        extraHTTPHeaders,
        timeout: 30 * 1000,
    });
};

// Gets authorized user context by cookie
export const getAuthorizedContextByCookie = async (
    userContext: UserContext,
    cookies: Array<Cookie>,
) => {
    return request.newContext({
        baseURL: userContext.baseUrl,
        storageState: {
            cookies,
            origins: [],
        },
    });
};
