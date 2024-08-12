import { BasePage } from '@pages/basePage';
import { Locator, Page } from '@playwright/test';
import { ElementState } from '@constants/elementState';
import { Constants } from '@constants/constants';

export class DashboardPage extends BasePage {
    constructor(
        page: Page,
        // @ts-ignore
        private dashboardToolbar: Locator = page.locator(`div#prism-toolbar`),
        // [aria-label] isn't used in [dashboardTitle] locator because of using this UI element in different branches
        private dashboardTitle: Locator = dashboardToolbar.locator(`div.toolbar-breadcrumbs`),
        private dashboardTitleInput: Locator = dashboardTitle.locator(`input`),
        private shareButton: Locator = dashboardToolbar.locator(
            `button[data-path='dashboards.share']`,
        ),
        private addWidgetButton: Locator = dashboardToolbar.locator(`button.btn--new-widget`),
        private pdfReportSettingsButton: Locator = dashboardToolbar.locator(
            `button.js--btn-pdf-preview`,
        ),
        private optionsButton: Locator = dashboardToolbar.locator(
            `button.js--btn-dashboard-settings`,
        ),
        private sharedModeToggle: Locator = dashboardToolbar.locator(`shared-mode-toggle`),
        private sharedModeToggleTooltip: Locator = page.locator(
            `div.shared-mode-switcher--tooltip`,
        ),
        private changeColorPaletteButton: Locator = dashboardToolbar.locator(
            `button.js--btn--change-colors`,
        ),
        private lockIcon: Locator = dashboardToolbar.locator(
            `div.toolbar-dashboard--lock-icon__container`,
        ),
        private lockIconTooltip: Locator = page.locator(
            `div.toolbar-dashboard--lock-info--tooltip`,
        ),
        private colorPaletteItem: Locator = page.locator(`div#palette-menu div.palette-container`),
        private dashboardColumn: Locator = page.locator(`div.dashboard-layout-column-host`),
        private widgetHeader: Locator = page.locator(`widget-header`),
        private widgetTitle: Locator = page.locator(`[data-model='widget.title']`),
        private sharedModeLockedNotification: Locator = page.locator(
            'div.shared-mode--locked-notification',
        ),
        private dashboardError: Locator = page.locator(`div.dashboard-error-wrapper`),
        private dashboard: Locator = page.locator(`dashboard.dashboard`),
    ) {
        super(page);
    }

    async getDashboardTitle(): Promise<string> {
        return this.dashboardTitle.innerText();
    }

    async clickDashboardTitle(): Promise<void> {
        await this.dashboardTitle.click();
    }

    async typeIntoDashboardTitleInput(title: string): Promise<void> {
        await this.dashboardTitleInput.fill(title);
    }

    async isDashboardTitleEditable(): Promise<boolean> {
        return (await this.dashboardTitle.locator('input').count()) !== 0;
    }

    async waitDashboardTitleToBe(title: string): Promise<void> {
        await this.dashboardTitle.getByText(title, { exact: true }).waitFor({ timeout: 60 * 1000 });
    }

    async isLockIconVisible(): Promise<boolean> {
        if (await this.lockIcon.isVisible()) {
            return !(await this.lockIcon.getAttribute(Constants.CLASS))?.includes('lock-icon-hide');
        } else {
            return false;
        }
    }

    async hoverOverLockIcon(): Promise<void> {
        await this.lockIcon.hover();
    }

    async getLockIconTooltipText(): Promise<string> {
        return this.lockIconTooltip.innerText();
    }

    async clickToolbarShareButton(): Promise<void> {
        await this.shareButton.click();
    }

    async waitShareButtonVisibilityState(state: ElementState): Promise<void> {
        await this.shareButton.waitFor({ state });
    }

    async isShareButtonPendingChanges(): Promise<boolean> {
        const classAttributeValue = await this.shareButton.getAttribute(Constants.CLASS);

        if (classAttributeValue) {
            return classAttributeValue.includes('has-pending-changes');
        } else {
            throw new Error(`Element for 'Share' button does not have class attribute`);
        }
    }

    async clickAddWidgetButton(): Promise<void> {
        await this.addWidgetButton.click();
    }

    async clickPdfReportSettingsButton(): Promise<void> {
        await this.pdfReportSettingsButton.click();
    }

    async clickOptionsButton(): Promise<void> {
        await this.optionsButton.click();
    }

    async waitSharedModeToggleVisibilityState(state: ElementState): Promise<void> {
        await this.sharedModeToggle.waitFor({ state });
    }

    async hoverOverSharedModeToggle(): Promise<void> {
        await this.sharedModeToggle.hover();
    }

    async getSharedModeToggleTooltipText(): Promise<string> {
        return this.sharedModeToggleTooltip.innerText();
    }

    async isSharedModeToggleButtonDisabled(buttonName: string): Promise<boolean> {
        return this.getSharedModeToggleButton(buttonName).isDisabled();
    }

    async clickSharedModeToggleButton(buttonName: string): Promise<void> {
        await this.getSharedModeToggleButton(buttonName).click();
    }

    async clickChangeColorPaletteButton(): Promise<void> {
        await this.changeColorPaletteButton.click();
    }

    async clickColorPaletteItem(colorPalette: string): Promise<void> {
        await this.colorPaletteItem.getByText(colorPalette, { exact: true }).click();
    }

    async dragWidgetToDashboardColumn(widgetTitle: string, columnIndex: number): Promise<void> {
        await this.widgetHeader
            .filter({
                has: this.widgetTitle.getByText(widgetTitle, { exact: true }),
            })
            .dragTo(this.dashboardColumn.nth(columnIndex - 1));
    }

    async getDashboardColumnsNumber(): Promise<number> {
        return this.dashboardColumn.count();
    }

    async waitSharedModeLockedNotificationVisibilityState(state: ElementState): Promise<void> {
        await this.sharedModeLockedNotification.waitFor({ state });
    }

    async getSharedModeLockedNotificationText(): Promise<string> {
        return this.sharedModeLockedNotification.innerText();
    }

    async getDashboardErrorText(): Promise<string> {
        return this.dashboardError.innerText();
    }

    async waitAddWidgetButtonVisibilityState(state: ElementState): Promise<void> {
        await this.addWidgetButton.waitFor({ state });
    }

    async isDashboardInDesignMode(): Promise<boolean> {
        return (await this.dashboard.getAttribute(Constants.CLASS))!.includes('editing');
    }

    private getSharedModeToggleButton(buttonName: string): Locator {
        return this.sharedModeToggle.getByTestId(buttonName);
    }

    async waitDashboardErrorVisibilityState(state: ElementState): Promise<void> {
        await this.dashboardError.waitFor({ state });
    }
}
