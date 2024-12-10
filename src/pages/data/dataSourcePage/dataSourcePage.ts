import { BasePage } from '@pages/basePage';
import { Locator, Page } from '@playwright/test';
import { ElementState } from '@constants/elementState';

export class DataSourcePage extends BasePage {
    constructor(
        page: Page,
        private button: Locator = page.locator(`span.btn__text`),
        private dataSourceToolbar: Locator = page.locator(`div.prism-toolbar`),
        private dataSourceName: Locator = dataSourceToolbar.locator(`[class*='cubeName']`),
        private toolbarButton: Locator = dataSourceToolbar.locator(`button:has([class^='btn'])`),
        private publishButton: Locator = dataSourceToolbar.locator(
            `button:has(span[class*='general-publish'])`,
        ),
        private addDataButton: Locator = dataSourceToolbar.locator(`button.sis-add-data-btn`),
        private relationshipsButton: Locator = dataSourceToolbar.locator(
            `button:has(span[class*='relationship'])`,
        ),
        private buildCubeTooltip: Locator = page.locator(`[role='tooltip']`),
        private buildCubeTooltipButton: Locator = buildCubeTooltip.locator(`.btn`),
        private buildCubeLogsTooltip: Locator = page.locator(`[aria-label='Build Logs']`),
        private buildCubeLogsResultMessage: Locator = buildCubeLogsTooltip.locator(
            `[class*='BuildSummary__title'], [class*='LogItem__errorMessage']`,
        ),
        private replaceAllBuildTypeButton: Locator = page.locator(`div.app-icon--buildpanel-replace-all`),
        private changesOnlyBuildTypeButton: Locator = page.locator(`span[class*='changes-only']`),
        private notification: Locator = page.locator(`span[class*='Notification__title']`),
        private optionButton: Locator = page.locator(`button[aria-label='cube-menu-button']`),
        private tooltip: Locator = page.locator(`div.rc-tooltip-inner`),
        private optionItem: Locator = page.locator(`li[data-menu-item]`),
        private tableViewContainer: Locator = page.locator(
            `div[class*='TableView__tableViewContainer']`,
        ),
        private customizeColumnsButton: Locator = tableViewContainer.locator(
            `button:has(span[name='general-settings'])`,
        ),
        private customizeColumnsModal: Locator = page.locator(
            `div[class='ReactModalPortal'] div[aria-label='CustomizeColumns']`,
        ),
        private customizeColumnsModalButton: Locator = customizeColumnsModal.locator(
            `div[class*='TableView__customizeColumnsButtons'] button`,
        ),
        private customizeColumnsModalItem: Locator = customizeColumnsModal.locator(
            `div[data-rbd-draggable-id*='item']`,
        ),
        private customizeColumnsModalItemCheckBox: Locator = page.locator(
            `span[class*='MuiCheckbox-root']`,
        ),
        private customizeColumnsModalItemLabel: Locator = page.locator(
            `span[class*='MuiTypography-bodyLabel']`,
        ),
        private tableHeader: Locator = page.locator(`div[class*='MuiDataGrid-columnHeaders']`),
        private tableHeaderColumn: Locator = tableHeader.locator(
            `div[class*='MuiDataGrid-columnHeader'][role='columnheader']`,
        ),
    ) {
        super(page);
    }

    async getDataSourceName(): Promise<string> {
        return this.dataSourceName.innerText();
    }

    async clickToolbarButtonByText(buttonText: string): Promise<void> {
        await this.toolbarButton.getByText(buttonText, { exact: true }).click();
    }

    async clickPublishButton(): Promise<void> {
        await this.publishButton.click();
    }

    async clickAddDataButton(): Promise<void> {
        await this.addDataButton.click();
    }

    async clickRelationshipsButton(): Promise<void> {
        await this.relationshipsButton.click();
    }

    async waitBuildTooltipVisibilityState(state: ElementState): Promise<void> {
        await this.buildCubeTooltip.waitFor({ state });
    }

    async clickReplaceAllBuildTypeButton(): Promise<void> {
        await this.replaceAllBuildTypeButton.click();
    }

    async clickChangesOnlyBuildTypeButton(): Promise<void> {
        await this.changesOnlyBuildTypeButton.click();
    }

    async clickButtonOnBuildCubeTooltip(buttonText: string): Promise<void> {
        await this.buildCubeTooltipButton.getByText(buttonText, { exact: true }).click();
    }

    async waitBuildLogsTooltipVisibilityState(
        state: ElementState,
        timeoutSec?: number,
    ): Promise<void> {
        await this.buildCubeLogsTooltip.waitFor({
            state,
            timeout: timeoutSec && timeoutSec * 1000,
        });
    }

    async waitBuildResultTextVisibilityState(state: ElementState, timeout: number): Promise<void> {
        await this.buildCubeLogsResultMessage.waitFor({ state, timeout: timeout * 1000 });
    }

    async getBuildResultTextOnBuildCubeTooltip(): Promise<string> {
        return this.buildCubeLogsResultMessage.innerText();
    }

    async waitNotificationVisibilityState(
        notificationText: string,
        state: ElementState,
    ): Promise<void> {
        await this.notification.getByText(notificationText, { exact: true }).waitFor({ state });
    }

    async clickOptionsButton(): Promise<void> {
        await this.optionButton.click();
    }

    async waitOptionsMenuVisibilityState(state: ElementState): Promise<void> {
        await this.tooltip.waitFor({ state });
    }

    async clickMenuOptionItemByText(itemText: string): Promise<void> {
        await this.optionItem.getByText(itemText, { exact: true }).click();
    }

    async waitCustomizeColumnsButtonVisibilityState(state: ElementState): Promise<void> {
        await this.customizeColumnsButton.waitFor({ state });
    }

    async clickCustomizeColumnsButton(): Promise<void> {
        await this.customizeColumnsButton.click();
    }

    async waitCustomizeColumnsModalVisibilityState(state: ElementState): Promise<void> {
        await this.customizeColumnsModal.waitFor({ state });
    }

    async getColumnNamesAllInnerTexts(): Promise<string[]> {
        return this.tableHeaderColumn.allInnerTexts();
    }

    async clickCustomizeColumnCheckboxValueByName(columnName: string): Promise<void> {
        const columnItem = await this.customizeColumnsModalItem.filter({
            has: this.customizeColumnsModalItemLabel.getByText(columnName, { exact: true }),
        });
        await columnItem.locator(this.customizeColumnsModalItemCheckBox).click();
    }

    async clickButtonInsideCustomizeColumnsModalByText(text: string): Promise<void> {
        const button = await this.customizeColumnsModalButton.filter({
            has: this.button.getByText(text, { exact: true }),
        });
        await button.click();
    }
}
