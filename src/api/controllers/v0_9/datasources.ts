import { ApiVersion as API } from '@constants/restApiVersion';
import { getAuthorizedContext } from '@controllers/restClient';
import { UserContext } from '@config/UserContext';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class DatasourceV09 {
    private static readonly DATASOURCES = API.V0_9 + '/datasources';

    /**
     * Returns response contains all datasources that user can see
     * @param userContext   - user that makes the API call
     */
    static async getDatasources(userContext: UserContext): Promise<APIResponse> {
        const apiContext: APIRequestContext = await getAuthorizedContext(userContext);
        return apiContext.get(this.DATASOURCES, {
            params: {
                ['sharedWith']: 'r,w',
            },
        });
    }
}