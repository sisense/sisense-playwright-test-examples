import { ApiVersion as API } from '@constants/restApiVersion';
import { getAuthorizedContext } from '@controllers/restClient';
import { UserContext } from '@config/UserContext';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class RolesV09 {
    private static readonly ROLES = API.V0_9 + '/roles';

    static async getRoles(userContext: UserContext, roleName?: string): Promise<APIResponse> {
        const apiContext: APIRequestContext = await getAuthorizedContext(userContext);
        if (roleName) {
            return apiContext.get(this.ROLES + '/' + roleName);
        }
        return apiContext.get(this.ROLES);
    }
}