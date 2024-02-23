import { UserContext } from '@config/UserContext';
import { ApiVersion as API } from '@constants/restApiVersion';
import { getAuthorizedContext } from '@controllers/restClient';
import { DashboardShares } from '@models/DashboardPermission';
import { DashboardSharesSubscription } from '@models/DashboardSharesSubscription';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class SharesV09 {
    private static readonly SHARES = API.V0_9 + '/shares';
    private static readonly SHARES_DASHBOARD = this.SHARES + '/dashboard';
    private static readonly SUBSCRIPTION = '/subscription';

    static async postSharesDashboardById(
        dashboardId: string,
        data: DashboardShares,
        userContext: UserContext,
    ): Promise<APIResponse> {
        const apiContext: APIRequestContext = await getAuthorizedContext(userContext);
        return apiContext.post(`${this.SHARES_DASHBOARD}/${dashboardId}`, { data: data });
    }

    /**
     * Update user dashboard subscription
     *
     * @param dashboardId  - dashboard oid
     * @param data - dashboard shares subscription data
     * @param userContext - user that makes the API call
     */
    static async postSharesDashboardSubscriptionById(
        dashboardId: string,
        data: DashboardSharesSubscription,
        userContext: UserContext,
    ): Promise<APIResponse> {
        const apiContext: APIRequestContext = await getAuthorizedContext(userContext);
        return apiContext.post(`${this.SHARES_DASHBOARD}/${dashboardId}${this.SUBSCRIPTION}`, {
            data: data,
        });
    }
}
