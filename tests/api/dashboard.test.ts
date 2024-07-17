import { sisenseTest as test } from '@fixtures/sisenseTest.fixture';
import { DashboardsAPISteps } from '@steps/api/analytics/dashboards.api.steps';
import { UsersAPISteps } from '@steps/api/admin/users.api.steps';
import { RoleDisplayName as ROLE_NAME } from '@constants/roleDisplayName';
import { PermissionType } from '@constants/permissionType';
import { DashboardPermissionRule } from '@constants/dashboardPermissionRule';
import { UserContext } from '@config/UserContext';
import { DashboardSearchFilterType } from '@constants/dashboardSearchFilterType';
import { generateUserPassword, generateEmail } from '@utils/stringUtils';

test.describe('X-RAY-00023: Add dashboards and share via API', () => {
    const dashboardOne = 'dashboard-one-X-RAY-00023';
    const dashboardtwo = 'dashboard-two-X-RAY-00023';
    const datasourceTitle = 'Sample ECommerce';
    let adminUser: UserContext;

    test.beforeEach(async ({ userContext }) => {
        adminUser = await UsersAPISteps.addUser(
            {
                email: generateEmail(),
                roleName: ROLE_NAME.ADMIN,
                password: generateUserPassword(),
            },
            userContext,
        );
    });

    test.afterEach(async ({ userContext }) => {
        await UsersAPISteps.deleteUsers([adminUser], userContext);
        await DashboardsAPISteps.deleteDashboardsBulkByAdmin(
            [dashboardOne, dashboardtwo],
            userContext,
        );
    });

    test('X-RAY-00023 @examples', async ({ userContext }) => {
        await DashboardsAPISteps.addDashboard(dashboardOne, datasourceTitle, userContext);
        await DashboardsAPISteps.addDashboard(dashboardtwo, datasourceTitle, userContext);
        await DashboardsAPISteps.shareDashboard(
            dashboardtwo,
            {
                permissions: [
                    {
                        userGroupName: userContext.email,
                        type: PermissionType.USER,
                        subscribe: false,
                    },
                    {
                        userGroupName: adminUser.email,
                        type: PermissionType.USER,
                        subscribe: false,
                        rule: DashboardPermissionRule.CAN_DESIGN,
                    },
                ],
            },
            userContext,
        );
        await DashboardsAPISteps.verifyDashboardsSearchesReturnsOnlyDashboards(
            adminUser,
            '',
            DashboardSearchFilterType.ALL,
            [dashboardOne, dashboardtwo],
        );
    });
});