import { UserContext } from '@config/UserContext';
import { BasePage } from '@pages/basePage';
import { Locator, Page } from '@playwright/test';
import { ElementState } from '@constants/elementState';

export class AdminPage extends BasePage {
    constructor(
        page: Page,
        private urlSuffix: string = 'app/settings',
        private mainPanel: Locator = page.locator('[data-qa="prism-window-panel-main"]'),
    ) {
        super(page);
    }

    async waitAdminPageVisibilityState(state: ElementState): Promise<void> {
        await this.mainPanel.waitFor({ state });
    }

    async openAdminPageByUrl(userContext: UserContext): Promise<void> {
        await this.openByPartURL(this.urlSuffix, userContext);
    }

    async waitAdminPageLoaded(): Promise<void> {
        await this.mainPanel.waitFor({ timeout: 20 * 1000 });
    }
}
