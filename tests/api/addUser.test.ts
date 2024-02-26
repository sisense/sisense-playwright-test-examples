import { sisenseTest as test } from '@fixtures/sisenseTest.fixture';
import { RoleDisplayName as ROLE_NAME } from '@constants/roleDisplayName';
import { UsersAPISteps } from '@steps/api/admin/users.api.steps';
import { UserContext } from '@config/UserContext';

test.describe('X-RAY-00001: Add user by admin via API example', () => {
    let adminUser: UserContext;
    let viewer: UserContext;

    test.beforeEach(async ({ userContext }) => {
        adminUser = await UsersAPISteps.addUser(
            {
                email: 'admin@sisense.com',
                roleName: ROLE_NAME.ADMIN,
                password: 'Mh@960ks',
            },
            userContext,
        );
    });

    test.afterEach(async ({ userContext }) => {
        await UsersAPISteps.deleteUsers([viewer], adminUser);
        await UsersAPISteps.deleteUsers([adminUser], userContext);
    });

    test('X-RAY-00001 @examples', async ({ userContext, loginPageSteps }) => {
        await UsersAPISteps.verifyUsersArePresent(
            ['autotest@sisense.com', 'admin@sisense.com'],
            userContext,
        );

        await loginPageSteps.logIn(userContext);
        viewer = await UsersAPISteps.addUser(
            {
                email: 'viewer@sisense.com',
                roleName: ROLE_NAME.VIEWER,
                password: 'Bh$963zs',
            },
            adminUser,
        );

        await UsersAPISteps.verifyUsersArePresent(
            ['autotest@sisense.com', 'admin@sisense.com', 'viewer@sisense.com'],
            adminUser,
        );
    });
});
