import { BrowserSteps } from '@steps/ui/browser.steps';
import test, { Page } from '@playwright/test';
import { Widget } from '@pages/analytics/widgets/widget';
import { MenuPopup } from '@pages/analytics/menuPopup';

export class WidgetSteps extends BrowserSteps {
    constructor(
        page: Page,
        private widget = new Widget(page),
        private menuPopup = new MenuPopup(page),
    ) {
        super(page);
    }

    /**
     * Clicks widget menu button on widget on a dashboard by widget's title
     * If title is not defined - the first widget on a dashboard will be the target one
     * @param widgetTitle - title of widget (optional)
     */
    clickWidgetToolbarMenuButtonOnDashboard = async (widgetTitle?: string): Promise<void> => {
        await test.step(`Click ${widgetTitle ? `'${widgetTitle}'` : 'first'
            } widget menu button on 'Dashboard' page`, async () => {
                await this.widget.hoverOverWidgetBodyOnDashboard(widgetTitle);
                await this.widget.clickWidgetToolbarMenuButton(widgetTitle);
            });
    };

    /**
     * Verifies loading dots of all widgets on dashboard are not visible
     */
    verifyAllWidgetsLoaded = async (): Promise<void> => {
        await test.step(`Verify all widgets loading is finished`, async () => {
            await this.widget.waitLoadersHidden();
        });
    };
}