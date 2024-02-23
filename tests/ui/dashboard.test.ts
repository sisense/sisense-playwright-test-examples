import { sisenseTest as test } from '@fixtures/sisenseTest.fixture';
import { DashboardsAPISteps } from '@steps/api/analytics/dashboards.api.steps';
import { ElementState } from '@constants/elementState';
import { WidgetType } from '@constants/widgetType';

test.describe('X-RAY-00024: Add dashboards UI actions', () => {
    const dataModelName = 'Sample ECommerce';
    const dashboardName = 'dashboard-X-RAY-00024';
    const widgetName = 'widget-X-RAY-00024';

    test.afterEach(async ({ userContext }) => {
        await DashboardsAPISteps.deleteDashboardsBulkByAdmin([dashboardName], userContext);
    });
    test('X-RAY-00024 @examples', async ({
        userContext,
        loginPageSteps,
        analyticsNavverSteps,
        headerPageSteps,
        widgetSteps,
        newWidgetPopupSteps,
        analyticsDimensionsPopupSteps,
    }) => {
        await loginPageSteps.logIn(userContext);
        await headerPageSteps.openAnalyticsPage();
        await analyticsNavverSteps.createNewDashboard(dashboardName, dataModelName);
        await newWidgetPopupSteps.verifyDataSourceTitleTextToBe(dataModelName);
        await newWidgetPopupSteps.clickSelectDataButton();
        await analyticsDimensionsPopupSteps.addColumnFromTable('Age Range', 'Commerce');
        await newWidgetPopupSteps.clickAddMoreDataButton();
        await analyticsDimensionsPopupSteps.addColumnFromTable('Revenue', 'Commerce');
        await newWidgetPopupSteps.clickAddMoreDataButton();
        await analyticsDimensionsPopupSteps.addColumnFromTable('Condition', 'Commerce');
        await newWidgetPopupSteps.typeWidgetTitle(widgetName);
        await newWidgetPopupSteps.verifyWidgetBodyHasVisibilityState(ElementState.VISIBLE);
        await newWidgetPopupSteps.clickWidgetTypeIcon(WidgetType.COLUMN_CHART);
        await newWidgetPopupSteps.clickCreateButton();
        await widgetSteps.verifyAllWidgetsLoaded();
    });
});