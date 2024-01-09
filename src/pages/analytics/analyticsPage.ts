import { UserContext } from '@config/UserContext';
import { BasePage } from '@pages/basePage';
import { expect, Locator, Page } from '@playwright/test';

export class AnalyticsPage extends BasePage {
    constructor(
        page: Page,
        private urlSuffix: string = 'app/main/home',
        private homeGrid: Locator = page.locator('div.home-grid'),
        private dashboardQuickFilterButton: Locator = homeGrid.locator(`li.filters-menu__item`),
        private switchToListViewButton: Locator = homeGrid.locator(`span.app-icon--general-list`),
        private tileViewDashboardTitle: Locator = homeGrid.locator(
            `span.tile-item__title.js--rename-anchor`,
        ),
        private listViewDashboardRow: Locator = homeGrid.locator(`div.ui-grid-row`),
        private listViewDashboardTitle: Locator = homeGrid.locator(`div.ui-grid-cell:nth-child(2)`),
        private loadingDots: Locator = homeGrid.locator('div.loading-dots'),
    ) {
        super(page);
    }

    async waitAnalyticsPageOpened(): Promise<void> {
        await this.homeGrid.waitFor({ timeout: 30 * 1000 });
    }

    async openByUrl(userContext: UserContext): Promise<void> {
        await this.openByPartURL(this.urlSuffix, userContext);
    }

    async clickQuickDashboardFilterButtonByText(text: string): Promise<void> {
        await this.dashboardQuickFilterButton.getByText(text, { exact: true }).click();
    }

    async getQuickDashboardFilterButtonsTexts(): Promise<string[]> {
        return this.dashboardQuickFilterButton.allInnerTexts();
    }

    async clickSwitchToListViewButton(): Promise<void> {
        await this.switchToListViewButton.click();
    }

    async getAllDashboardsInTileView(): Promise<string[]> {
        return this.tileViewDashboardTitle.allInnerTexts();
    }

    async clickDashboardTileByText(text: string): Promise<void> {
        await this.tileViewDashboardTitle.getByText(text, { exact: true }).click();
    }

    async clickDashboardRowByTitle(title: string): Promise<void> {
        await this.listViewDashboardRow.getByText(title, { exact: true }).click();
    }

    async getAllDashboardsInListView(): Promise<string[]> {
        return this.listViewDashboardTitle.allInnerTexts();
    }

    async waitLoadingDotsNotVisible(): Promise<void> {
        try {
            await expect(this.loadingDots).toBeAttached({ timeout: 1000 });
        } catch (e) {}
        await expect(this.loadingDots).toBeHidden();
    }
}
