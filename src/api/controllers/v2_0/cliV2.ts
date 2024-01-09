import { getAuthorizedContext } from '@controllers/restClient';
import { APIResponse } from '@playwright/test';
import { ApiVersion as API } from '@constants/restApiVersion';
import { UserContext } from '@config/UserContext';

export class CliV2 {
    private static readonly CLI_EXECUTE = API.V2_0 + '/cli/execute';

    public static async postCliExecute(
        userContext: UserContext,
        body: string,
    ): Promise<APIResponse> {
        const apiContext = await getAuthorizedContext(userContext);
        return apiContext.post(this.CLI_EXECUTE, {
            data: body,
            headers: { ['content-type']: 'text/plain' },
            timeout: 60 * 1000,
        });
    }
}
