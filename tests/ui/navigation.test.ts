import { sisenseTest as test } from '@fixtures/sisenseTest.fixture';
import { RoleDisplayName as ROLE_NAME } from '@constants/roleDisplayName';
import { DashboardsAPISteps } from '@steps/api/analytics/dashboards.api.steps';
import { UsersAPISteps } from '@steps/api/admin/users.api.steps';
import { UserContext } from '@config/UserContext';
import { ElementState } from '@constants/elementState';
import { WidgetType } from '@constants/widgetType';
import { PermissionType } from '@constants/permissionType';
import { DashboardPermissionRule } from '@constants/dashboardPermissionRule';

test.describe('X-RAY-00003: Browser navigation test example', () => {
    let designerUser: UserContext;
    const cubeName = 'Sample ECommerce';
    const dashboardName = 'Sample-Ecommerce-X-RAY-00003';
    const widgetName = 'widget-X-RAY-00003';

    test.beforeEach(async ({ userContext }) => {
        designerUser = await UsersAPISteps.addUser(
            {
                email: 'designer00003@sisense.com',
                roleName: ROLE_NAME.DESIGNER,
                password: 'Bh$963zs',
            },
            userContext,
        );
        await UsersAPISteps.verifyUsersArePresent([designerUser.email], userContext);
    });

    test.afterEach(async ({ userContext }) => {
        await UsersAPISteps.deleteUsers([designerUser], userContext);
        await UsersAPISteps.verifyUsersAreNotPresent([designerUser.email], userContext);
        await DashboardsAPISteps.deleteDashboardsBulkByAdmin([dashboardName], userContext);
    });

    test('X-RAY-00003 @examples', async ({
        userContext,
        loginPageSteps,
        browserSteps,
        dashboardPageSteps,
        headerPageSteps,
        adminPageSteps,
        analyticsPageSteps,
        contextPage,
        analyticsNavverSteps,
        newWidgetPopupSteps,
        analyticsDimensionsPopupSteps,
        widgetSteps,
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
        await DashboardsAPISteps.shareDashboard(
            dashboardName,
            {
                permissions: [
                    {
                        userGroupName: userContext.email,
                        type: PermissionType.USER,
                        subscribe: false,
                    },
                    {
                        userGroupName: designerUser.email,
                        type: PermissionType.USER,
                        subscribe: false,
                        rule: DashboardPermissionRule.CAN_DESIGN,
                    },
                ],
            },
            userContext,
        );
        await browserSteps.reloadPage();
        await adminPageSteps.openAdminPageByUrl(userContext);
        await adminPageSteps.verifyIsAdminMainPanelVisible();
        await analyticsPageSteps.openAnalyticsPageByUrl(userContext);
        await adminPageSteps.openAdminPageByUrl(userContext);
        await adminPageSteps.verifyIsAdminMainPanelVisible();
        await headerPageSteps.openAnalyticsPage();
        await headerPageSteps.openDataPage();
        await headerPageSteps.openPulsePage();
        await headerPageSteps.openAdminPage();
        await headerPageSteps.userLogout();
        await loginPageSteps.verifyLoginPageIsOpen();
        await UsersAPISteps.userLogIn(contextPage, designerUser);
        await analyticsPageSteps.openAnalyticsPageByUrl(designerUser);
        await UsersAPISteps.verifyLoggedinUserEmailIs(designerUser, contextPage);
        await browserSteps.verifyPageURLContains('app/main/home');
        await UsersAPISteps.userLogOut(contextPage, designerUser);
        await analyticsPageSteps.openAnalyticsPageByUrl(designerUser);
        await browserSteps.verifyPageURLContains('app/account/login');
        await UsersAPISteps.userLogIn(contextPage, designerUser);
        await browserSteps.openPageByPartURL('app/main/pulse', designerUser);
        await browserSteps.verifyPageTitleIs('Sisense');
        await browserSteps.reloadPage();
        await browserSteps.verifyPageTitleIs('Sisense');
        await browserSteps.openBasePageURL(designerUser);
        await browserSteps.verifyPageURLContains('app/main/home');
        await dashboardPageSteps.openDashboardByURL(dashboardName, designerUser);
        await dashboardPageSteps.verifyDashboardTitleIs(dashboardName);
    });
});
