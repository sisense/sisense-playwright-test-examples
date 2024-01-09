import { BasePage } from '@pages/basePage';
import { Locator, Page } from '@playwright/test';

export class MenuPopup extends BasePage {
    constructor(
        page: Page,
        private menuContent: Locator = page.locator(`div.menu-content`),
        private visibleItem: Locator = menuContent.locator(`div.menu-item:not(.ng-hide)`),
        private subMenuContainer: Locator = page.locator(`div[class='menu-item-host']`),
        private applyConfirmButton: Locator = menuContent.locator(`button.confirm-btn--apply`),
    ) {
        super(page);
    }

    async clickOnItem(item: string): Promise<void> {
        await this.getItemByText(item).click();
    }

    async hoverOverItem(item: string): Promise<void> {
        await this.getItemByText(item).hover();
    }

    async clickOnApplyConfirmButton(): Promise<void> {
        await this.applyConfirmButton.click();
    }

    async getAllSubMenuVisibleItemNames(): Promise<string[]> {
        const allNames: string[] = await this.subMenuContainer
            .locator(this.visibleItem)
            .allInnerTexts();
        return allNames.filter((n) => n.length > 0);
    }

    private getItemByText(item: string): Locator {
        return this.visibleItem.getByText(item, { exact: true });
    }
}
