import { BrowserSteps } from '@steps/ui/browser.steps';
import test, { expect, Page } from '@playwright/test';
import { UserContext } from '@config/UserContext';
import { AnalyticsPage } from '@pages/analytics/analyticsPage';

export class AnalyticsPageSteps extends BrowserSteps {
    constructor(
        page: Page,
        private analyticsPage = new AnalyticsPage(page),
    ) {
        super(page);
    }

    /**
     * Opens the Analytics page by URL
     * @param userContext - user to get correct BaseURL
     */
    openAnalyticsPageByUrl = async (userContext: UserContext): Promise<void> => {
        await test.step(`Open 'Analytics' page by URL`, async () => {
            await this.analyticsPage.openByUrl(userContext);
        });
    };
}