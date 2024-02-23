import { BasePage } from '@pages/basePage';
import { Locator, Page } from '@playwright/test';

export class ImportDashboardPopup extends BasePage {
    constructor(
        page: Page,
        private successPopupContainer: Locator = page.locator('div.tp-all-succuess'),
        private successOkButton: Locator = successPopupContainer.locator('button.btn-ok'),
    ) {
        super(page);
    }

    async clickOkButton() {
        await this.successOkButton.click();
    }
}
