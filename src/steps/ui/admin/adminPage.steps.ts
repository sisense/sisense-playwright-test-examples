import { AdminPage } from '@pages/admin/adminPage';
import test, { expect, Page } from '@playwright/test';
import { BrowserSteps } from '@steps/ui/browser.steps';
import { UserContext } from '@config/UserContext';
import { ElementState } from '@constants/elementState';

export class AdminPageSteps extends BrowserSteps {
    constructor(page: Page, private adminPage = new AdminPage(page)) {
        super(page);
    }

    /**
     * Opens the Admin page by URL
     * @param userContext - user to get correct BaseURL
     */
    openAdminPageByUrl = async (userContext: UserContext): Promise<void> => {
        await test.step(`Open 'Admin' page by URL`, async () => {
            await this.adminPage.openAdminPageByUrl(userContext);
        });
    };

    /**
     * Verifies Admin 'main panel' UI element is visible
     */
    verifyIsAdminMainPanelVisible = async (): Promise<void> => {
        await test.step(`Verify main panel is 'visible' on 'Admin' page`, async () => {
            expect(this.adminPage.waitAdminPageVisibilityState(ElementState.VISIBLE));
        });
    };
}
