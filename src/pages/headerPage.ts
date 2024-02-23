import { Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';

export class HeaderPage extends BasePage {
    constructor(
        page: Page,
        private headerContainer: Locator = page.locator('div.prism-header'),
        private headerLinkAnalytics: Locator = headerContainer.locator(
            `li a[href$='/app/main/home']`,
        ),
    ) {
        super(page);
    }

    async clickHeaderLinkAnalytics(): Promise<void> {
        await this.headerLinkAnalytics.click();
    }
}