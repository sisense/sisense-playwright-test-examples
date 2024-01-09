import { BrowserSteps } from '@steps/ui/browser.steps';
import { MenuPopup } from '@pages/analytics/menuPopup';
import test, { Page } from '@playwright/test';

export class MenuPopupSteps extends BrowserSteps {
    constructor(page: Page, private menuPopup = new MenuPopup(page)) {
        super(page);
    }

    /**
     * Clicks on item in menu popup
     * @param item - menu item by text
     */
    clickOnItem = async (item: string): Promise<void> => {
        await test.step(`Click on item '${item}'`, async () => {
            await this.menuPopup.clickOnItem(item);
        });
    };
}