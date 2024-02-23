import { DashboardSearchQuickFilter } from '@models/DashboardSearchQuickFilter';
import { UserContext } from '@config/UserContext';
import { APIRequestContext, APIResponse } from '@playwright/test';
import { getAuthorizedContext } from '@controllers/restClient';
import { ApiVersion as API } from '@constants/restApiVersion';
import { Dashboard } from '@models/Dashboard';

export class DashboardsV1 {

    private static readonly DASHBOARDS = API.V1_0 + '/dashboards';
    private static readonly DASHBOARDS_SEARCHES = this.DASHBOARDS + '/searches';
    private static readonly DASHBOARDS_IMPORT_BULK = this.DASHBOARDS + '/import/bulk';
    private static readonly DASHBOARDS_ADMIN = this.DASHBOARDS + '/admin';
    private static readonly DASHBOARDS_ADMIN_BY_NAME = this.DASHBOARDS_ADMIN + '?name=';
    private static readonly DASHBOARDS_BULK_ADMIN_ACCESS =
        this.DASHBOARDS + '/bulk?adminAccess=true&dashboardIds=';

    static async postDashboardsSearches(
        dashboardSearchQuickFilter: DashboardSearchQuickFilter,
        userContext: UserContext,
    ): Promise<APIResponse> {
        const apiContext: APIRequestContext = await getAuthorizedContext(userContext);
        return apiContext.post(this.DASHBOARDS_SEARCHES, { data: dashboardSearchQuickFilter });
    }

    static async getDashboards(userContext: UserContext, name?: string): Promise<APIResponse> {
        const apiContext: APIRequestContext = await getAuthorizedContext(userContext);
        if (name) return apiContext.get(this.DASHBOARDS, { params: { ['name']: name! } });
        else return apiContext.get(this.DASHBOARDS);
    }

    static async postDashboardsImportBulk(
        dashboards: Dashboard[],
        userContext: UserContext,
        params?: { [key: string]: string | number | boolean },
    ): Promise<APIResponse> {
        const apiContext: APIRequestContext = await getAuthorizedContext(userContext);
        return apiContext.post(this.DASHBOARDS_IMPORT_BULK, { data: dashboards, params });
    }

    static async getDashboardsAdminByName(
        userContext: UserContext,
        dashboardTitle: string,
    ): Promise<APIResponse> {
        const apiContext: APIRequestContext = await getAuthorizedContext(userContext);
        return apiContext.get(`${this.DASHBOARDS_ADMIN_BY_NAME}${dashboardTitle}`);
    }

    static async deleteDashboardsBulk(
        dashboardIds: string[],
        userContext: UserContext,
    ): Promise<APIResponse> {
        const apiContext: APIRequestContext = await getAuthorizedContext(userContext);
        return apiContext.delete(`${this.DASHBOARDS_BULK_ADMIN_ACCESS}${dashboardIds}`);
    }
}