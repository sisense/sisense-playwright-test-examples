import { sisenseTest as test } from '@fixtures/sisenseTest.fixture';
import { RoleDisplayName as ROLE_NAME } from '@constants/roleDisplayName';
import { UsersAPISteps } from '@steps/api/admin/users.api.steps';
import { UserContext } from '@config/UserContext';
import { BuildType } from '@constants/buildType';
import { generateUserPassword, generateEmail } from '@utils/stringUtils';

test.describe('X-RAY-00004: Build a cube example', () => {
    let adminUser: UserContext;
    const cubeName = 'Sample Lead Generation';

    test.beforeEach(async ({ userContext }) => {
        adminUser = await UsersAPISteps.addUser(
            {
                email: generateEmail(),
                roleName: ROLE_NAME.ADMIN,
                password: generateUserPassword(),
            },
            userContext,
        );
        await UsersAPISteps.verifyUsersArePresent([adminUser.email], userContext);
        await UsersAPISteps.setGotItForUser(adminUser);
    });

    test.afterEach(async ({ userContext }) => {
        await UsersAPISteps.deleteUsers([adminUser], userContext);
        await UsersAPISteps.verifyUsersAreNotPresent([adminUser.email], userContext);
    });

    test('X-RAY-00004 @examples', async ({ contextPage, dataPageSteps, dataSourcePageSteps }) => {
        await UsersAPISteps.userLogIn(contextPage, adminUser);
        await dataPageSteps.openDataPageByUrl(adminUser);
        await dataPageSteps.searchAndOpenDataModelByName(cubeName);
        await dataSourcePageSteps.verifyDataSourceTitleEquals(cubeName);
        await dataSourcePageSteps.buildCubeAndVerifyResultText(
            BuildType.REPLACE_ALL,
            'Build Succeeded',
            180,
        );
    });
});
