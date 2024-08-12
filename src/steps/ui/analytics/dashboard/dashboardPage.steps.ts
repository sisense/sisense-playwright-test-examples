import test, { expect, Page } from '@playwright/test';
import { BrowserSteps } from '@steps/ui/browser.steps';
import { UserContext } from '@config/UserContext';
import { Dashboard } from '@models/Dashboard';
import { DashboardPage } from '@pages/analytics/dashboard/dashboardPage';
import { Widget } from '@pages/analytics/widgets/widget';
import { DashboardsAPISteps } from '@steps/api/analytics/dashboards.api.steps';

export class DashboardPageSteps extends BrowserSteps {
    constructor(
        page: Page,
        private dashboardPage = new DashboardPage(page),
        private widget = new Widget(page),
    ) {
        super(page);
    }

    /**
    * Opens dashboard with title by URL or throws an Error if not found
    * @param dashboardTitle - title of the dashboard
    * @param userContext - user to get correct BaseURL
    */
    openDashboardByURL = async (
        dashboardTitle: string,
        userContext: UserContext,
    ): Promise<void> => {
        await test.step(`Open dashboard with title '${dashboardTitle}' by '${userContext.email}' user by URL`, async (): Promise<void> => {
            const dashboard: Dashboard | undefined = await DashboardsAPISteps.getDashboardByTitle(
                dashboardTitle,
                userContext,
            );
            if (!dashboard) {
                throw new Error(
                    `Dashboard with '${dashboardTitle}' title wasn't found by '${userContext.email}'`,
                );
            }
            const dashboardId: string | undefined = dashboard!.oid;
            await this.openPageByPartURL(
                `app/main/dashboards/${dashboardId}`,
                userContext,
                false,
            );
            await this.dashboardPage.waitDashboardTitleToBe(dashboardTitle);
            await this.widget.waitLoadersHidden();
            await this.widget.waitWidgetsLoaded();
        });
    };

    /**
     * Verifies dashboard title matches the expected one
     * @param expectedDashboardTitle - expected dashboard title
     */
    verifyDashboardTitleIs = async (expectedDashboardTitle: string): Promise<void> => {
        await test.step(`Verify dashboard title is '${expectedDashboardTitle}' on 'Dashboard' page`, async (): Promise<void> => {
            await expect
                .poll(
                    async () => {
                        return this.dashboardPage.getDashboardTitle();
                    },
                    {
                        message:  `Dashboard title does not match expected`},
                )
                .toEqual(expectedDashboardTitle)
        });
    };
}