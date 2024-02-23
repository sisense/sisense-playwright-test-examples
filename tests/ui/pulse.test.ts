import { sisenseTest as test } from '@fixtures/sisenseTest.fixture';
import { PulseConditionType } from '@constants/pulseConditionType';
import { UserContext } from '@config/UserContext';
import { ElasticubesAPISteps } from '@steps/api/data/elasticubes.api.steps';
import { DashboardsAPISteps } from '@steps/api/analytics/dashboards.api.steps';
import { PermissionType } from '@constants/permissionType';
import { DefaultSystemGroup } from '@constants/defaultGroup';
import { DatamodelPermissionOption } from '@constants/datamodelPermissionOption';
import { UsersAPISteps } from '@steps/api/admin/users.api.steps';
import { RoleDisplayName as ROLE_NAME } from '@constants/roleDisplayName';
import { ElementState } from '@constants/elementState';
import { WidgetType } from '@constants/widgetType';

test.describe('X-RAY-00022: Add pulse notifications', () => {
    let adminContext: UserContext;
    const cubeName = 'Sample ECommerce';
    const dashboardName = 'Sample-Ecommerce-X-RAY-00022';
    const widgetName = 'widget-X-RAY-00022';

    test.beforeEach(async ({ userContext }) => {
        adminContext = await UsersAPISteps.addUser(
            {
                email: 'admin-X-RAY-00022@sisense.com',
                roleName: ROLE_NAME.ADMIN,
                password: 'Mh@960ks',
            },
            userContext,
        );

        await ElasticubesAPISteps.shareElasticube(
            [
                {
                    userGroupName: DefaultSystemGroup.EVERYONE,
                    permission: DatamodelPermissionOption.USE,
                    type: PermissionType.GROUP,
                },
            ],
            cubeName,
            userContext,
        );
    });

    test.afterEach(async ({ userContext }) => {
        await UsersAPISteps.deleteUsers([adminContext], userContext);
        await DashboardsAPISteps.deleteDashboardsBulkByAdmin([dashboardName], userContext);
    });

    test('X-RAY-00022 @examples', async ({
        userContext,
        loginPageSteps,
        widgetSteps,
        menuPopupSteps,
        addToPulsePopupSteps,
        analyticsNavverSteps,
        headerPageSteps,
        newWidgetPopupSteps,
        analyticsDimensionsPopupSteps,
    }) => {
        await loginPageSteps.logIn(userContext);
        await headerPageSteps.openAnalyticsPage();
        await analyticsNavverSteps.createNewDashboard(dashboardName, cubeName);
        await newWidgetPopupSteps.verifyDataSourceTitleTextToBe(cubeName);
        await newWidgetPopupSteps.clickSelectDataButton();
        await analyticsDimensionsPopupSteps.addColumnFromTable('Revenue', 'Commerce');
        await newWidgetPopupSteps.typeWidgetTitle(widgetName);
        await newWidgetPopupSteps.verifyWidgetBodyHasVisibilityState(ElementState.VISIBLE);
        await newWidgetPopupSteps.clickWidgetTypeIcon(WidgetType.INDICATOR);
        await newWidgetPopupSteps.clickCreateButton();
        await widgetSteps.verifyAllWidgetsLoaded();
        await widgetSteps.clickWidgetToolbarMenuButtonOnDashboard(widgetName);
        await menuPopupSteps.clickOnItem(`Add to Pulse...`);
        await addToPulsePopupSteps.clickConditionType(PulseConditionType.ALWAYS);
        await addToPulsePopupSteps.clickAdvancedBasicLink();
        await addToPulsePopupSteps.addUsersGroupsToPulseList([adminContext.email]);
        await addToPulsePopupSteps.clickAddAdvancedButton();
    });
});
