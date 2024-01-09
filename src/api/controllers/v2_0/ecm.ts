import { getAuthorizedContext } from '@controllers/restClient';
import { APIResponse } from '@playwright/test';
import { ApiVersion as API } from '@constants/restApiVersion';
import { UserContext } from '@config/UserContext';

export class EcmV2 {
    private static readonly ECM = API.V2_0 + '/ecm';

    public static async postEcm(userContext: UserContext, body: object): Promise<APIResponse> {
        const apiContext = await getAuthorizedContext(userContext);
        return apiContext.post(this.ECM, {
            data: body,
            headers: { ['content-type']: 'application/json' },
            timeout: 30 * 1000,
        });
    }
}
