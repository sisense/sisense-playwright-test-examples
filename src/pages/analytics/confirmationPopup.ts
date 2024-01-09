import { BasePage } from '@pages/basePage';
import { Locator, Page } from '@playwright/test';

export class ConfirmationPopup extends BasePage {
    constructor(
        page: Page,
        private confirmationPopup: Locator = page.locator(`div.confirmation-popup`),
        private okButton: Locator = confirmationPopup.locator(`button.conf-btn-ok`),
    ) {
        super(page);
    }

    async clickOkButton() {
        await this.okButton.click();
    }
}
