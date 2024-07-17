import { sisenseTest as test } from '@fixtures/sisenseTest.fixture';
import { UsersAPISteps } from '@steps/api/admin/users.api.steps';
import { RoleDisplayName as ROLE_NAME } from '@constants/roleDisplayName';
import { DatamodelAPISteps } from '@steps/api/data/datamodel.api.steps';
import { DbType } from '@constants/dbType';
import { ElementState } from '@constants/elementState';
import { UserContext } from '@config/UserContext';
import { BuildType } from '@constants/buildType';
import { generateUserPassword, generateEmail } from '@utils/stringUtils';

// Test will fail as src/config/db.config.ts file does not contains real db credentials
// Please fill in src/config/db.config.ts file with db connection information
test.describe('X-RAY-00021: Create a cube with db connector', () => {
    let dataAdmin: UserContext;
    const dataModelTitle = 'DbCube00021';
    const dbName = 'Test';
    const tableNameOne = '';
    const tableNameTwo = '';

    test.beforeEach(async ({ userContext }) => {
        dataAdmin = await UsersAPISteps.addUser(
            {
                email: generateEmail(),
                roleName: ROLE_NAME.DATA_ADMIN,
                password: generateUserPassword(),
            },
            userContext,
        );
        await UsersAPISteps.setGotItForUser(dataAdmin);
    });

    test.afterEach(async ({ userContext }) => {
        await DatamodelAPISteps.deleteDatamodelByTitle(dataModelTitle, dataAdmin);
        await UsersAPISteps.deleteUsers([dataAdmin], userContext);
    });

    test('X-RAY-00021 @examples', async ({
        dataPageSteps,
        dataSourcePageSteps,
        addDataPopupSteps,
        page,
    }) => {
        test.fail();
        await UsersAPISteps.userLogIn(page, dataAdmin);
        await dataPageSteps.openDataPageByUrl(dataAdmin);
        await dataPageSteps.createDataModelWithName('ElastiCube', dataModelTitle);
        await dataSourcePageSteps.verifyDataSourceTitleEquals(dataModelTitle);
        await dataSourcePageSteps.clickAddDataButton();
        await addDataPopupSteps.clickConnectorByText('Oracle');
        await addDataPopupSteps.typeLocationForDatabase(DbType.ORACLE);
        await addDataPopupSteps.typeUserNameForDatabase(DbType.ORACLE);
        await addDataPopupSteps.typePasswordForDatabase(DbType.ORACLE);
        await addDataPopupSteps.clickNextOrDoneButton();
        await addDataPopupSteps.searchAndSelectDatabase(dbName);
        await addDataPopupSteps.searchAndSelectTables([tableNameOne, tableNameTwo]);
        await addDataPopupSteps.clickNextOrDoneButton();
        await addDataPopupSteps.verifyPopupVisibilityState(ElementState.HIDDEN);
        await dataSourcePageSteps.buildCubeAndVerifyResultText(
            BuildType.REPLACE_ALL,
            'Build Succeeded',
            180,
        );
    });
});
