import { BasePage } from '@pages/basePage';
import { Locator, Page } from '@playwright/test';

export class AnalyticsNavver extends BasePage {
    constructor(
        page: Page,
        private dashboardListItem: Locator = page.locator(`div.list-item`),
        private navverItemTitle: Locator = page.locator(`a[data-qa='navver-item-title-text-link']`),
        private navverOptionsButton: Locator = page.locator(
            `button[data-qa='navver-header-btn-options']`,
        ),
    ) {
        super(page);
    }

    async clickDashboardByTitle(title: string): Promise<void> {
        await this.getDashboardListItemByTitle(title).click();
    }

    async clickNavverOptionsButton(): Promise<void> {
        await this.navverOptionsButton.click();
    }

    private getDashboardListItemByTitle(title: string): Locator {
        return this.dashboardListItem.filter({
            has: this.navverItemTitle.getByText(title, { exact: true }),
        });
    }
}