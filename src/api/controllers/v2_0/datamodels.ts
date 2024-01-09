import { getAuthorizedContext } from '@controllers/restClient';
import { ApiVersion as API } from '@constants/restApiVersion';
import { UserContext } from '@config/UserContext';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class DatamodelsV2 {
    private static readonly DATAMODELS = API.V2_0 + '/datamodels';
    private static readonly DATAMODELS_SCHEMA = this.DATAMODELS + '/schema';

    static async getDatamodelsSchema(
        userContext: UserContext,
        params?: { [key: string]: string | number | boolean },
    ): Promise<APIResponse> {
        const apiContext: APIRequestContext = await getAuthorizedContext(userContext);
        return apiContext.get(this.DATAMODELS_SCHEMA, {
            params,
            timeout: 60 * 1000,
        });
    }

    static async deleteDatamodels(
        datamodelId: string,
        userContext: UserContext,
    ): Promise<APIResponse> {
        const apiContext: APIRequestContext = await getAuthorizedContext(userContext);
        return apiContext.delete(`${this.DATAMODELS}/${datamodelId}`, { timeout: 60 * 1000 });
    }
}
