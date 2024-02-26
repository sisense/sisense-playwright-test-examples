import test, { expect, Page } from '@playwright/test';
import { BrowserSteps } from '@steps/ui/browser.steps';
import { DataSourcePage } from '@pages/data/dataSourcePage/dataSourcePage';
import { BuildType } from '@constants/buildType';
import { ElementState } from '@constants/elementState';

export class DataSourcePageSteps extends BrowserSteps {
    constructor(page: Page, private dataSourcePage = new DataSourcePage(page)) {
        super(page);
    }

    /**
     * Verifies datasource title matches the expected one
     * @param dataSourceTitle - title of the expected datasource
     */
    verifyDataSourceTitleEquals = async (dataSourceTitle: string) => {
        await test.step(`Verify DataSource title is '${dataSourceTitle}' on 'Data Source' page`, async () => {
            await expect(async () => {
                expect(await this.dataSourcePage.getDataSourceName()).toBe(dataSourceTitle);
            }).toPass({ timeout: 10 * 1000 });
        });
    };

    /**
     * Builds the cube, waits and checks build result text
     * @param buildType         - type of the build (Replace All, Changes Only)
     * @param buildResultText   - expected build results text (example: 'Build Succeeded')
     * @param timeoutSeconds    - time to wait for the build results (in seconds)
     */
    buildCubeAndVerifyResultText = async (
        buildType: BuildType,
        buildResultText: string,
        timeoutSeconds: number,
    ) => {
        await test.step(`Build the cube with '${buildType}' build type, expected state '${buildResultText}', timeout '${timeoutSeconds}' seconds`, async () => {
            await this.dataSourcePage.clickToolbarButtonByText('Build');
            await this.dataSourcePage.waitBuildTooltipVisibilityState(ElementState.VISIBLE);
            if (buildType === BuildType.REPLACE_ALL) {
                await this.dataSourcePage.clickReplaceAllBuildTypeButton();
            } else if (buildType === BuildType.CHANGES_ONLY) {
                await this.dataSourcePage.clickChangesOnlyBuildTypeButton();
            } else throw new Error(`Build type '${buildType}' is not defined`);

            await this.dataSourcePage.clickButtonOnBuildCubeTooltip('Build');
            await this.dataSourcePage.waitBuildLogsTooltipVisibilityState(ElementState.VISIBLE);
            await this.dataSourcePage.waitBuildResultTextVisibilityState(
                ElementState.VISIBLE,
                timeoutSeconds,
            );
            expect(await this.dataSourcePage.getBuildResultTextOnBuildCubeTooltip()).toBe(
                buildResultText,
            );
        });
    };

    /**
     * Clicks 'Add Data' button
     */
    clickAddDataButton = async () => {
        await test.step(`Click '+ Data' button on 'Data Source' page`, async () => {
            await this.dataSourcePage.clickAddDataButton();
        });
    };
}