import { ApiVersion as API } from '@constants/restApiVersion';
import { getAuthorizedContext } from '@controllers/restClient';
import { UserContext } from '@config/UserContext';
import { APIRequestContext, APIResponse } from '@playwright/test';
import { Dashboard } from '@models/Dashboard';
import { Widget } from '@models/Widget';

export class DashboardsV09 {
    private static readonly DASHBOARDS = API.V0_9 + '/dashboards';
    private static readonly DUPLICATE = '/duplicate';

    static async deleteDashboard(
        dashboardId: string,
        userContext: UserContext,
    ): Promise<APIResponse> {
        const apiContext: APIRequestContext = await getAuthorizedContext(userContext);
        return apiContext.delete(`${this.DASHBOARDS}/${dashboardId}`);
    }

    static async postDashboards(
        dashboard: Dashboard,
        userContext: UserContext,
    ): Promise<APIResponse> {
        const apiContext: APIRequestContext = await getAuthorizedContext(userContext);
        return apiContext.post(this.DASHBOARDS, { data: dashboard });
    }

    static async getDashboards(userContext: UserContext): Promise<APIResponse> {
        const apiContext: APIRequestContext = await getAuthorizedContext(userContext);
        return apiContext.get(this.DASHBOARDS);
    }

    static async getDashboardsById(
        dashboardId: string,
        userContext: UserContext,
    ): Promise<APIResponse> {
        const apiContext: APIRequestContext = await getAuthorizedContext(userContext);
        return apiContext.get(`${this.DASHBOARDS}/${dashboardId}`);
    }

    static async getDashboardsDuplicate(
        dashboardId: string,
        userContext: UserContext,
    ): Promise<APIResponse> {
        const apiContext: APIRequestContext = await getAuthorizedContext(userContext);
        return apiContext.get(
            `${this.DASHBOARDS}/${dashboardId}${this.DUPLICATE}?sharedMode=false`,
        );
    }

    static async postWidget(
        userContext: UserContext,
        dashboardId: string,
        widget: Widget,
    ): Promise<APIResponse> {
        const apiContext: APIRequestContext = await getAuthorizedContext(userContext);
        return apiContext.post(`${this.DASHBOARDS}/${dashboardId}/widgets`, { data: widget });
    }

    static async getWidget(
        userContext: UserContext,
        dashboardId: string,
        widgetId: string,
    ): Promise<APIResponse> {
        const apiContext: APIRequestContext = await getAuthorizedContext(userContext);
        return apiContext.get(`${this.DASHBOARDS}/${dashboardId}/widgets/${widgetId}`);
    }
}
