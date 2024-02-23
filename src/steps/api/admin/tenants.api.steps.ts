import { UserContext } from '@config/UserContext';
import test, { APIResponse, expect } from '@playwright/test';
import { getTenantQueryParams, TenantsV1 } from '@controllers/v1_0/tenants';

export class TenantsAPISteps {

    /**
     * Gets all tenants in the system
     * @param userContext - [user]{@link User} that makes the API call
     * @param queryParams - [query params]{@link getTenantQueryParams} for the request
     * @returns body response in json
     */
    static async getAllTenants(
        userContext: UserContext,
        queryParams?: getTenantQueryParams,
    ): Promise<Tenant[]> {
        return test.step(`Get all tenants by '${userContext.email}' via API`, async () => {
            const response = await TenantsV1.getTenants(userContext, queryParams);
            expect(response.status()).toBe(200);
            return response.json();
        });
    }

    /**
     * Gets a Tenant id by its name
     * @param tenantName - name of the [Tenant]{@link Tenant}
     * @param userContext - [user]{@link User} that makes the API call
     * @returns id of the Tenant
     */
    static async getTenantIdByName(
        tenantName: string,
        userContext: UserContext,
    ): Promise<string | undefined> {
        return test.step(`Get id of '${tenantName}' tenant by '${userContext.email}' via API`, async () => {
            const tenants: Tenant[] = await this.getAllTenants(userContext);
            const tenantId: string | undefined = tenants.find(
                (tenant) => tenant.name === tenantName,
            )?._id;
            if (!tenantId) console.warn(`Tenant with '${tenantName}' name wasn't found`);
            return tenantId;
        });
    }
}