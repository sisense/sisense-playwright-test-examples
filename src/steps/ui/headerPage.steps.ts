import { BrowserSteps } from '@steps/ui/browser.steps';
import test, { expect, Page } from '@playwright/test';
import { HeaderPage } from '@pages/headerPage';
import { AnalyticsPage } from '@pages/analytics/analyticsPage';
import { DataPage } from '@pages/data/dataPage';
import { PulsePage } from '@pages/pulse/pulsePage';
import { AdminPage } from '@pages/admin/adminPage';
import { ElementState } from '@constants/elementState';

export class HeaderPageSteps extends BrowserSteps {
    constructor(
        page: Page,
        private headerPage = new HeaderPage(page),
        private analyticsPage = new AnalyticsPage(page),
        private dataPage = new DataPage(page),
        private pulsePage = new PulsePage(page),
        private adminPage = new AdminPage(page),
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

    /**
     * Opens the Data page via header link button
     */
    openDataPage = async (): Promise<void> => {
        await test.step(`Open 'Data' page`, async () => {
            await this.headerPage.clickHeaderLinkData();
            await this.verifyPageIsLoaded();
            await this.dataPage.waitDataPageOpened();
        });
    };

    /**
     * Opens the Pulse page via header link button
     */
    openPulsePage = async (): Promise<void> => {
        await test.step(`Open 'Pulse' page`, async () => {
            await this.headerPage.clickHeaderLinkPulse();
            await this.verifyPageIsLoaded();
            await this.pulsePage.waitPulsePageOpened();
        });
    };

    /**
     * Opens the Admin page via header link button
     */
    openAdminPage = async (): Promise<void> => {
        await test.step(`Open 'Admin' page`, async () => {
            await this.headerPage.clickHeaderLinkAdmin();
            await this.verifyPageIsLoaded();
            await this.adminPage.waitAdminPageLoaded();
        });
    };

    /**
     * Logouts user via 'User Menu' and wait another page is open and loaded
     */
    userLogout = async (): Promise<void> => {
        await test.step(`User logout via 'User menu'`, async () => {
            const currentURL: string = this.headerPage.getPageURL();
            await this.openUserMenuPopup();
            await this.clickUserPopupListItemByText('Sign Out');
            await this.page.waitForURL((url: URL) => url.href !== currentURL);
            await this.verifyPageIsLoaded();
        });
    };

    /**
     * Opens 'User Menu' popup in top right corner
     */
    openUserMenuPopup = async (): Promise<void> => {
        await test.step(`Open 'User menu' popup`, async () => {
            await this.headerPage.clickUserMenuPopup();
            await this.headerPage.waitUserMenuPopupHasState(ElementState.VISIBLE);
        });
    };

    /**
     * Clicks 'User Menu' popup list item by its text
     * @param text - text of the list item to click on
     */
    clickUserPopupListItemByText = async (text: string): Promise<void> => {
        await test.step(`Click '${text}' list item on 'User menu' popup`, async () => {
            await this.headerPage.clickUserPopupListItemByText(text);
            await this.headerPage.waitPageIsLoaded();
        });
    };
}