import { UserContext } from '@config/UserContext';
import { BasePage } from '@pages/basePage';
import { Locator, Page } from '@playwright/test';
import { ElementState } from '@constants/elementState';

export class DataPage extends BasePage {
    constructor(
        page: Page,
        private urlSuffix: string = 'app/data',
        private dataModelRow: Locator = page.locator(`div[class*='MuiDataGrid-row']`),
        private dataModelRowCellName: Locator = page.locator(
            `div[class*='modelName'] div[class*='cell']`,
        ),
        private dataModelRowCellStatusText: Locator = page.locator(
            `div[class*='DataModelList__cubeStatusText']`,
        ),
        private dataModelMenuButton: Locator = page.locator(`button[class*='menu']`),
        private searchFieldInput: Locator = page.locator(`input[aria-label='input']`),
        private button: Locator = page.locator('.main-container .btn'),
        private importModelButton: Locator = page.locator(
            `button:has(span[class*='general-import'])`,
        ),
        private quickFilterButton: Locator = page.locator(`.main-container button[type='button']`),
        private addCubeModal: Locator = page.locator(`[aria-label="AddCubeModal"]`),
        private addCubeModalInput: Locator = addCubeModal.locator('input'),
        private addCubeModalButton: Locator = addCubeModal.locator('button'),
        private menuTooltip: Locator = page.locator(`[role='tooltip']`),
        private menuTooltipItem: Locator = menuTooltip.locator(`li`),
        private buildDestinationContainer: Locator = addCubeModal.locator(
            `[class*='buildDestinationContainer']`,
        ),
        private buildDestinationDropdown: Locator = buildDestinationContainer.locator(
            `[class*='dropDownButton']`,
        ),
    ) {
        super(page);
    }

    async openByUrl(userContext: UserContext): Promise<void> {
        await this.openByPartURL(this.urlSuffix, userContext);
    }

    async typeIntoSearchField(searchTerm: string): Promise<void> {
        await this.searchFieldInput.fill(searchTerm);
    }

    async clickDataModelByName(dataModelName: string): Promise<void> {
        await this.dataModelRowCellName.getByText(dataModelName, { exact: true }).click();
    }

    async clickDataModelMenuButton(dataModelName: string): Promise<void> {
        const targetDataModelRow: Locator = this.getTargetDataModelRowByName(dataModelName);
        await targetDataModelRow.locator(this.dataModelMenuButton).click();
    }

    async getDataModelRunningStatusText(dataModelName: string): Promise<string> {
        const targetDataModelRow: Locator = this.getTargetDataModelRowByName(dataModelName);
        return await targetDataModelRow.locator(this.dataModelRowCellStatusText).innerText();
    }

    async clickButtonByText(text: string): Promise<void> {
        await this.button.getByText(text, { exact: true }).click();
    }

    async clickImportModelButton(): Promise<void> {
        await this.importModelButton.click();
    }

    async clickQuickFilterButtonByText(text: string): Promise<void> {
        await this.quickFilterButton.getByText(text, { exact: true }).click();
    }

    async typeIntoAddCubeModalInput(text: string): Promise<void> {
        await this.addCubeModalInput.fill(text);
    }

    async clickButtonOnAddCubePopup(text: string): Promise<void> {
        await this.addCubeModalButton.getByText(text, { exact: true }).click();
    }

    async clickTooltipMenuItem(menuItem: string): Promise<void> {
        await this.menuTooltipItem.getByText(menuItem, { exact: true }).click();
    }

    async waitDataPageOpened(): Promise<void> {
        await this.dataModelRow.first().waitFor({ timeout: 20 * 1000 });
    }

    async waitDataModelByNameVisibilityState(
        dataModelName: string,
        state: ElementState,
    ): Promise<void> {
        await this.dataModelRowCellName
            .getByText(dataModelName, { exact: true })
            .waitFor({ state });
    }

    async clickBuildDestinationDropdown(): Promise<void> {
        await this.buildDestinationDropdown.click();
    }

    async clickBuildDestinationMenuItem(menuItem: string): Promise<void> {
        await this.menuTooltipItem.getByText(menuItem, { exact: true }).click();
    }

    async waitBuildDestinationDropdownTitleVisibilityState(
        title: string,
        state: ElementState,
    ): Promise<void> {
        await this.buildDestinationContainer.getByTitle(title, { exact: true }).waitFor({ state });
    }

    private getTargetDataModelRowByName(dataModelName: string): Locator {
        return this.dataModelRow.filter({
            has: this.dataModelRowCellName.getByText(dataModelName, { exact: true }),
        });
    }
}
