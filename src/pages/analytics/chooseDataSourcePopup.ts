import { BasePage } from '@pages/basePage';
import { Locator, Page } from '@playwright/test';

export class ChooseDataSourcePopup extends BasePage {
    constructor(
        page: Page,
        private popup: Locator = page.locator(`div.popover-container`),
        private dataSourceItem: Locator = popup.locator(`div.datasource`),
    ) {
        super(page);
    }

    async clickDataSourceByName(title: string) {
        await this.dataSourceItem.getByText(title, { exact: true }).click();
    }
}
