import { BasePage } from '@pages/basePage';
import { Locator, Page } from '@playwright/test';

export class NewDashboardPopup extends BasePage {
    constructor(
        page: Page,
        private popup: Locator = page.locator(`div.md-content`),
        private dataSourceSelector: Locator = popup.locator(`.datasource-selector`),
        private dashboardTitleInput: Locator = popup.locator(`div.title-input-holder input`),
        private createButton: Locator = popup.locator(`button.btn-ok`),
    ) {
        super(page);
    }

    async clickDataSourceDropdown(): Promise<void> {
        await this.dataSourceSelector.click({ timeout: 20 * 1000 });
    }

    async clickCreateButton(): Promise<void> {
        await this.createButton.click();
    }

    async typeIntoDashboardTitleInput(title: string): Promise<void> {
        await this.dashboardTitleInput.fill(title);
    }

    async getDashboardTitleInputValue(): Promise<string> {
        return this.dashboardTitleInput.inputValue();
    }
}
