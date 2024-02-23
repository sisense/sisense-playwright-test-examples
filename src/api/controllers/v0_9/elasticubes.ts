import { ApiVersion as API } from '@constants/restApiVersion';
import { DatamodelPermission } from '@models/DatamodelPermission';
import { UserContext } from '@config/UserContext';
import { APIRequestContext, APIResponse } from '@playwright/test';
import { getAuthorizedContext } from '@controllers/restClient';

export class Elasticubes {
    private static readonly ELASTICUBES = API.V0_9 + '/elasticubes';
    private static readonly ELASTICUBES_DATASECURITY = this.ELASTICUBES + '/datasecurity';

    static async putElasticubesPermissionsByTitleOrId(
        elasticube: string,
        data: DatamodelPermission[],
        userContext: UserContext,
        server: string = 'localhost',
    ): Promise<APIResponse> {
        const apiContext: APIRequestContext = await getAuthorizedContext(userContext);
        return apiContext.put(`${this.ELASTICUBES}/${server}/${elasticube}/permissions`, {
            data: data,
        });
    }
}