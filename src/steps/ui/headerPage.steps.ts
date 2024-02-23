import { BrowserSteps } from '@steps/ui/browser.steps';
import test, { expect, Page } from '@playwright/test';
import { HeaderPage } from '@pages/headerPage';
import { AnalyticsPage } from '@pages/analytics/analyticsPage';

export class HeaderPageSteps extends BrowserSteps {
    constructor(
        page: Page,
        private headerPage = new HeaderPage(page),
        private analyticsPage = new AnalyticsPage(page),
    ) {
        super(page);
    }

    /**
     * Opens the Analytics page via header link button
     */
    openAnalyticsPage = async (): Promise<void> => {
        await test.step(`Open 'Analytics' page`, async () => {
            await this.headerPage.clickHeaderLinkAnalytics();
            await this.verifyPageIsLoaded();
            await this.analyticsPage.waitAnalyticsPageOpened();
        });
    };
}