import { sisenseTest as test } from '@fixtures/sisenseTest.fixture';
import { RoleDisplayName as ROLE_NAME } from '@constants/roleDisplayName';
import { UsersAPISteps } from '@steps/api/admin/users.api.steps';
import { CliAPISteps } from '@steps/api/cli/cliAPISteps';
import { UserContext } from '@config/UserContext';
import { PodName } from '@constants/podName';

test.describe('X-RAY-00006: Restart pods', () => {
    let admin: UserContext;

    test.beforeEach(async ({ userContext }) => {
        admin = await UsersAPISteps.addUser(
            {
                email: 'admin00006@sisense.com',
                roleName: ROLE_NAME.ADMIN,
                password: 'Bh$963zs',
            },
            userContext,
        );
    });

    test.afterEach(async ({ userContext }) => {
        await UsersAPISteps.deleteUsers([admin], userContext);
    });

    test('X-RAY-00006 @examples', async ({ userContext }) => {
        await CliAPISteps.waitAllPodsRunning(userContext);
        await CliAPISteps.restartSpecificPods([PodName.CONFIGURATION, PodName.API_GATEWAY], admin);
        await CliAPISteps.waitSpecificPodsRunning(
            [PodName.CONFIGURATION, PodName.API_GATEWAY],
            admin,
        );
        await CliAPISteps.waitAllPodsRunning(admin);
    });
});
