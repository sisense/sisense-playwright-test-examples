import { Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';
import { ElementState } from '@constants/elementState';

export class HeaderPage extends BasePage {
    constructor(
        page: Page,
        private headerContainer: Locator = page.locator('div.prism-header'),
        private userMenu: Locator = page.locator('li#user'),
        private notificationsIcon: Locator = headerContainer.locator(`li#notifications`),
        private userMenuPopup: Locator = page.locator('div.user-menu-popoverContainer'),
        private userMenuPopupListItem: Locator = userMenuPopup.locator('li'),
        private headerLinkData: Locator = headerContainer.locator(`li a[href$='/app/data']`),
        private headerLinkAnalytics: Locator = headerContainer.locator(
            `li a[href$='/app/main/home']`,
        ),
        private headerLinkPulse: Locator = headerContainer.locator(`li a[href$='/app/main/pulse']`),
        private headerLinkAdmin: Locator = headerContainer.locator(`li a[href$='/app/settings']`),
    ) {
        super(page);
    }

    async clickUserMenuPopup(): Promise<void> {
        await this.userMenu.click();
    }

    async clickNotificationsIcon(): Promise<void> {
        await this.notificationsIcon.click();
    }

    async getAmountOfUnreadNotifications(): Promise<string> {
        return this.notificationsIcon.innerText();
    }

    async waitUserMenuPopupHasState(state: ElementState): Promise<void> {
        await this.userMenuPopup.waitFor({ state });
    }

    async clickUserPopupListItemByText(text: string): Promise<void> {
        await this.userMenuPopupListItem.getByText(text).click();
    }

    async clickHeaderLinkData(): Promise<void> {
        await this.headerLinkData.click();
    }

    async clickHeaderLinkAnalytics(): Promise<void> {
        await this.headerLinkAnalytics.click();
    }

    async clickHeaderLinkPulse(): Promise<void> {
        await this.headerLinkPulse.click();
    }

    async clickHeaderLinkAdmin(): Promise<void> {
        await this.headerLinkAdmin.click();
    }
}
