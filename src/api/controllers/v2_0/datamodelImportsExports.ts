import { Datamodel } from '@models/Datamodel';
import { UserContext } from '@config/UserContext';
import { APIRequestContext, APIResponse } from '@playwright/test';
import { BuildDestination } from '@constants/buildDestination';
import { getAuthorizedContext } from '@controllers/restClient';
import { ApiVersion as API } from '@constants/restApiVersion';
import { failIfStandardCloud } from '../../../../tests/mt-mode-config/tenant.config';

export class DatamodelImportsExportsV2 {
    private static readonly DATAMODELIMPORT = API.V2_0 + '/datamodel-imports';
    private static readonly DATAMODELIMPORT_SCHEMA = this.DATAMODELIMPORT + '/schema';

    static async postDatamodelImportsSchema(
        datamodelSchema: Datamodel,
        userContext: UserContext,
        newTitle?: string,
    ): Promise<APIResponse> {
        // Additional validation for SKU env to avoid elasticube import
        failIfStandardCloud({
            message:
                'Elasticube schema model is not allowed to import on SKU. Please use B2D schema model.',
            condition:
                datamodelSchema.buildDestination?.destination === BuildDestination.ELASTICUBE,
        });

        const apiContext: APIRequestContext = await getAuthorizedContext(userContext);
        return apiContext.post(this.DATAMODELIMPORT_SCHEMA, {
            data: datamodelSchema,
            timeout: 30 * 1000,
            params: newTitle ? { ['newTitle']: newTitle! } : undefined,
        });
    }
}