import test, { expect, Page } from '@playwright/test';
import { BrowserSteps } from '@steps/ui/browser.steps';
import { AnalyticsNavver } from '@pages/analytics/analyticsNavver';
import { DashboardPage } from '@pages/analytics/dashboard/dashboardPage';
import { Widget } from '@pages/analytics/widgets/widget';
import { MenuPopup } from '@pages/analytics/menuPopup';
import { NewDashboardPopup } from '@pages/analytics/newDashboardPopup';
import { ChooseDataSourcePopup } from '@pages/analytics/chooseDataSourcePopup';
import { ElementState } from '@constants/elementState.ts';

export class AnalyticsNavverSteps extends BrowserSteps {
    constructor(
        page: Page,
        private analyticsNavver = new AnalyticsNavver(page),
        private dashboardPage = new DashboardPage(page),
        private widget = new Widget(page),
        private menuPopup = new MenuPopup(page),
        private newDashboardPopup = new NewDashboardPopup(page),
        private chooseDataSourcePopup = new ChooseDataSourcePopup(page),
    ) {
        super(page);
    }

    /**
     * Opens the dashboard from Analytics navver and waits widgets loaded
     * @param title - dashboard title
     * @param waitWidgetsToBeLoaded - wait all widgets to be loaded (default is true)
     */
    openDashboardByTitle = async (title: string, waitWidgetsToBeLoaded: boolean = true) => {
        await test.step(`Open '${title}' dashboard in navver`, async () => {
            await this.analyticsNavver.waitDashboardListItemVisibilityState(title, ElementState.VISIBLE);
            await this.analyticsNavver.clickDashboardByTitle(title);
            await this.dashboardPage.mouseMove(-150, 0);
            await this.dashboardPage.waitDashboardTitleToBe(title);

            if (waitWidgetsToBeLoaded) {
                await this.widget.waitLoadersHidden();
                await this.widget.waitWidgetsLoaded();
            }
        });
    };

    /**
     * Creates a new dashboard with a title for a specific data source
     * @param dataModelName     - datasource name the title will be created on
     * @param title             - title of new dashboard
     */
    createNewDashboard = async (title: string, dataModelName: string) => {
        await test.step(`Create '${title}' dashboard for '${dataModelName}' data model in navver`, async () => {
            await this.analyticsNavver.clickNavverOptionsButton();
            await this.menuPopup.clickOnItem('New Dashboard');
            await this.newDashboardPopup.clickDataSourceDropdown();
            await this.chooseDataSourcePopup.clickDataSourceByName(dataModelName);
            await expect(async () => {
                expect(await this.newDashboardPopup.getDashboardTitleInputValue()).toBe(
                    dataModelName,
                );
            }).toPass({ timeout: 10 * 1000 });
            await this.newDashboardPopup.typeIntoDashboardTitleInput(title);
            await this.newDashboardPopup.clickCreateButton();
            await this.dashboardPage.waitDashboardTitleToBe(title);
        });
    };
}