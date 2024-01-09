import { BasePage } from '@pages/basePage';
import { Locator, Page } from '@playwright/test';
import { WidgetMode } from '@constants/widgetMode';
import { ElementState } from '@constants/elementState';

export class Widget extends BasePage {
    constructor(
        page: Page,
        private previewWidget: Locator = page.locator(`[class~='widget-preview']`),
        private dashboardWidget: Locator = page.locator(`widget[type]`),
        private editWidget: Locator = page.locator(`[data-widget-preview]`),
        private widgetBody: Locator = page.locator(`[class^='widget-body']`),
        private widgetTitleInDashboardMode: Locator = page.locator(`widget-title`),
        private widgetLoadingContainer: Locator = page.locator(`div.widget-loading`),
        private widgetToolbarMenuButton: Locator = page.locator(`button.widget-toolbar-btn--menu`),
        private widgetToolbarEditButton: Locator = page.locator(`button.widget-toolbar-btn--edit`),
        private widgetError: Locator = page.locator(`div[class='widget-error-overlay']`),
    ) {
        super(page);
    }

    /**
     * Waits all the UI loaders are hidden during expected time
     * @param timeoutSec - (optional) timeout in seconds (default is 180 sec)
     */
    public async waitLoadersHidden(timeoutSec: number = 180) {
        try {
            await this.widgetLoadingContainer.first().waitFor({ timeout: 3 * 1000 });
        } catch (error) {}

        for (const dot of await this.widgetLoadingContainer.all()) {
            await dot.waitFor({ state: ElementState.HIDDEN, timeout: timeoutSec * 1000 });
        }
    }

    /**
     * Waits timer API call which indicates completed dashboard loading
     */
    public async waitWidgetsLoaded() {
        try {
            await this.page.waitForResponse('**/api/v1/logs/timer', { timeout: 5 * 1000 });
        } catch (e) {
            console.log(`'timer' request wasn't found during dashboard loading`);
        }
    }

    async hoverOverWidgetBodyOnDashboard(widgetTitle?: string) {
        const widgetBody: Locator = this.getWidgetContainerInDashboardMode(widgetTitle);
        await widgetBody.hover();
    }

    async clickWidgetToolbarMenuButton(widgetTitle?: string) {
        const widgetBody: Locator = this.getWidgetContainerInDashboardMode(widgetTitle);
        await widgetBody.locator(this.widgetToolbarMenuButton).click({ timeout: 10 * 1000 });
    }

    async clickWidgetToolbarEditButton(widgetTitle?: string) {
        const widgetBody: Locator = this.getWidgetContainerInDashboardMode(widgetTitle);
        await widgetBody.locator(this.widgetToolbarEditButton).click();
    }

    /**
     * Returns widget body Locator by WidgetMode (PREVIEW, EDIT, DASHBOARD)
     * @param widgetMode        - widget mode where widget is in (DASHBOARD, EDIT, PREVIEW)
     * @param widgetTitle       - widget title should be used only in DASHBOARD WidgetMode
     *                          to find unique widget on a Dashboard
     *                          (if it's missed - first widget will be taken)
     */
    getWidgetBodyByWidgetMode(widgetMode: WidgetMode, widgetTitle?: string): Locator {
        switch (widgetMode) {
            case WidgetMode.PREVIEW:
                return this.previewWidget.locator(this.widgetBody.first());
            case WidgetMode.EDIT:
                return this.editWidget.locator(this.widgetBody.first());
            case WidgetMode.DASHBOARD:
                return this.getWidgetContainerInDashboardMode(widgetTitle)
                    .locator(this.widgetBody.first())
                    .first();
        }
    }

    /**
     * Waits for widget by title on a Dashboard error Visibility state (takes first widget if widgetTitle is skipped)
     * @param state         - expected state of the widget error element
     * @param widgetTitle   - title of widget (optional)
     */
    async waitWidgetOnDashboardErrorVisibility(state: ElementState, widgetTitle?: string) {
        const targetWidget: Locator = this.getWidgetContainerInDashboardMode(widgetTitle);
        await targetWidget.locator(this.widgetError).waitFor({ state });
    }

    /**
     * Gets locator of widget container by widget title or first widget (if title is skipped)
     * @param widgetTitle - title of widget (optional)
     * @return widget container locator
     * @private
     */
    private getWidgetContainerInDashboardMode(widgetTitle?: string): Locator {
        return widgetTitle
            ? this.dashboardWidget
                  .filter({
                      has: this.widgetTitleInDashboardMode.getByText(widgetTitle, { exact: true }),
                  })
                  .first()
            : this.dashboardWidget.first();
    }

    async waitAnyWidgetErrorHasVisibilityState(state: ElementState) {
        await this.widgetError.first().waitFor({ state });
    }

    async getWidgetsTitles(): Promise<string[]> {
        return this.widgetTitleInDashboardMode.allInnerTexts();
    }
}
