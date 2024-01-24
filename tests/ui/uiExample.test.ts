import { sisenseTest as test } from '@fixtures/sisenseTest.fixture';
import { UsersAPISteps } from '@steps/api/admin/users.api.steps';
import { DatamodelAPISteps } from '@steps/api/data/datamodel.api.steps';
import { EcmAPISteps } from '@steps/api/data/ecm.api.steps';
import { DashboardsAPISteps } from '@steps/api/analytics/dashboards.api.steps';

test.describe('Login via API and open dashboard', () => {
    const dataModelName = 'S93351';
    const dashboardName = 'S93351';
    const widgetName = 'S93351_Pivot';

    test.beforeEach(async ({ userContext }): Promise<void> => {
        await DatamodelAPISteps.importDatamodelSchema(`${dataModelName}.smodel`, userContext);
        await EcmAPISteps.publishDatamodelByTitle(dataModelName, userContext);
        await DashboardsAPISteps.importDashboard(`${dashboardName}.dash`, userContext);
    });

    test.afterEach(async ({ userContext }): Promise<void> => {
        await DashboardsAPISteps.deleteDashboardByTitle(dashboardName, userContext);
        await DatamodelAPISteps.deleteDatamodelByTitle(dataModelName, userContext);
    });

    test('UI test example with login via API @parallel @example', async ({
        userContext,
        page,
        dashboardPageSteps,
        widgetSteps,
        menuPopupSteps,
    }): Promise<void> => {
        await UsersAPISteps.userLogIn(page, userContext);
        await dashboardPageSteps.openDashboardByURL(dashboardName, userContext);
        await widgetSteps.clickWidgetToolbarMenuButtonOnDashboard(widgetName);
        await menuPopupSteps.clickOnItem('Download');
    });
});