import { ApiVersion as API } from '@constants/restApiVersion';
import { getAuthorizedContext } from '@controllers/restClient';
import { UserContext } from '@config/UserContext';

export interface getTenantQueryParams {
    [key: string]: string | number | boolean;
}

export class TenantsV1 {
    private static readonly TENANTS = API.V1_0 + '/tenants';

    static async getTenants(userContext: UserContext, queryParams?: getTenantQueryParams) {
        const apiContext = await getAuthorizedContext(userContext);
        return apiContext.get(this.TENANTS, { params: queryParams });
    }

    static async postTenants(tenant: Tenant, userContext: UserContext) {
        const apiContext = await getAuthorizedContext(userContext);
        return apiContext.post(this.TENANTS, { data: tenant });
    }

    static async deleteTenants(tenantId: string, userContext: UserContext) {
        const apiContext = await getAuthorizedContext(userContext);
        return apiContext.delete(`${this.TENANTS}/${tenantId}`);
    }
}
