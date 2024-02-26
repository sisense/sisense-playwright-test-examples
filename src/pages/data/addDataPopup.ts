import { BasePage } from '@pages/basePage';
import { Locator, Page } from '@playwright/test';
import { ElementState } from '@constants/elementState';

export class AddDataPopup extends BasePage {
    constructor(
        page: Page,
        private addDataPopup: Locator = page.locator(`[aria-label='LiveConnectionWizard']`),
        private button: Locator = addDataPopup.locator(`button:has(.btn__text)`),
        private nextOrDoneButton: Locator = addDataPopup.locator(
            `button[class*='WizardFooter__ok']`,
        ),
        private checkbox: Locator = page.locator(`span[class*='Checkbox__checkbox-unchecked']`),
        // Select Provider
        private connector: Locator = addDataPopup.locator(`[class*='item']`),
        // Connect
        private inputConnectionString: Locator = addDataPopup.locator(
            `input[name='connectionString']`,
        ),
        private inputLocation: Locator = addDataPopup.locator(`input[name='Server']`),
        private inputUserName: Locator = addDataPopup.locator(
            `input[name='userName'],input[name='UserName']`,
        ),
        private inputPassword: Locator = addDataPopup.locator(
            `input[name='Password'],input[name='password']`,
        ),
        private fileSourceTileContainer: Locator = addDataPopup.locator(
            `div[class*='GenericInput__genericInputContainer']`,
        ),
        private fileSourceTileTitle: Locator = page.locator(
            `span[class*='GenericInput__inputTitle']`,
        ),
        private fileSourceTileButton: Locator = page.locator(`div[class*='ButtonInput__button']`),
        private uploadedFileRow: Locator = addDataPopup.locator(
            `div[class*='MultiselectInput__row_']`,
        ),
        private uploadedFileName: Locator = page.locator(`div[class*='cellTextContainer']`),
        private uploadedFileCheckbox: Locator = page.locator(
            `span[class*='MultiselectInput__checkbox']`,
        ),
        private inputFolderPathContainer: Locator = page.locator(
            `div[class*='dynamicInputContainer']:has(span[class*='wizard-add-folder'])`,
        ),
        private inputFolderPathContainerInput: Locator = inputFolderPathContainer.locator(`input`),
        private inputFilePathContainer: Locator = page.locator(
            `div[class*='dynamicInputContainer']:has(span[class*='wizard-new-page'])`,
        ),
        private inputFilePathContainerInput: Locator = inputFilePathContainer.locator(`input`),
        private inputFilePathRadioButton: Locator = page.locator(`input[value='files']`),
        private inputFolderPathRadioButton: Locator = page.locator(`input[value='folder']`),
        private loading: Locator = page.locator(`div[class*='FileLoading']`),
        // Select Data
        private searchLoopButton: Locator = addDataPopup.locator(`button[class*='search']`),
        private searchInputField: Locator = addDataPopup.locator(`input[class*='search']`),
        private databaseListItem: Locator = addDataPopup.locator(`div[class*='listItemToClick']`),
        private tableListItem: Locator = addDataPopup.locator(
            `div[class*='tableListItemContainer']`,
        ),
    ) {
        super(page);
    }

    async waitPopupVisibilityState(state: ElementState, timeoutSec: number = 30) {
        await this.addDataPopup.waitFor({ state, timeout: timeoutSec * 1000 });
    }

    async clickConnectorByText(text: string): Promise<void> {
        await this.connector
            .getByText(text, { exact: true })
            .last()
            .click({ timeout: 20 * 1000 });
    }

    async typeIntoConnectingString(text: string): Promise<void> {
        await this.inputConnectionString.fill(text);
    }

    async typeIntoLocationInputField(text: string): Promise<void> {
        await this.inputLocation.fill(text);
    }

    async typeIntoUserNameInputField(text: string): Promise<void> {
        await this.inputUserName.fill(text);
    }

    async typeIntoPasswordInputField(text: string): Promise<void> {
        await this.inputPassword.fill(text);
    }

    async clickButtonByText(text: string): Promise<void> {
        await this.button.getByText(text, { exact: true }).click();
    }

    async clickNextOrDoneButton(): Promise<void> {
        await this.nextOrDoneButton.click();
    }

    async waitButtonHasState(
        btnText: string,
        state: ElementState,
        timeoutSec?: number,
    ): Promise<void> {
        await this.button
            .getByText(btnText, { exact: true })
            .last()
            .waitFor({ state, timeout: timeoutSec && timeoutSec * 1000 });
    }

    async clickSearchLoop(): Promise<void> {
        await this.searchLoopButton.last().click();
    }

    async typeIntoSearchInput(text: string): Promise<void> {
        await this.searchInputField.fill(text);
    }

    async waitDatabaseListItemHasState(state: ElementState): Promise<void> {
        await this.databaseListItem.first().waitFor({ state, timeout: 10 * 1000 });
    }

    async waitTableListItemHasState(state: ElementState): Promise<void> {
        await this.tableListItem.first().waitFor({ state, timeout: 10 * 1000 });
    }

    async clickDatabaseByText(text: string): Promise<void> {
        await this.databaseListItem.getByTitle(text, { exact: true }).click();
    }

    async setTableCheckboxSelectionState(tableName: string, checked: boolean): Promise<void> {
        const targetTableListItem = await this.getTableListItemByTextContent(tableName);
        if (targetTableListItem)
            await targetTableListItem.locator(this.checkbox).setChecked(checked);
        else throw new Error(`'${tableName}' table wasn't found`);
    }

    async clickFileSourceButtonByText(btnText: string): Promise<void> {
        await this.fileSourceTileContainer
            .filter({ has: this.fileSourceTileTitle.getByText(btnText, { exact: true }) })
            .locator(this.fileSourceTileButton)
            .click();
    }

    async uploadDataModelSourceFile(fileName: string): Promise<void> {
        await this.uploadFile(fileName);
    }

    async waitDataModelSourceFileIsUploaded(): Promise<void> {
        await this.loading.waitFor({ timeout: 3 * 1000 });
        await this.loading.waitFor({ state: ElementState.HIDDEN, timeout: 60 * 1000 });
    }

    async clickUploadedFilesCheckbox(fileName: string): Promise<void> {
        const uploadedFileCheckbox: Locator = this.getUploadedFileRowByFileName(fileName).locator(
            this.uploadedFileCheckbox,
        );
        await uploadedFileCheckbox.first().click();
    }

    async clickFileRadioButton(): Promise<void> {
        await this.inputFilePathRadioButton.click();
    }

    async clickFolderRadioButton(): Promise<void> {
        await this.inputFolderPathRadioButton.click();
    }

    async typeIntoFilePathInput(path: string): Promise<void> {
        await this.inputFilePathContainerInput.fill(path);
    }

    async typeIntoFolderPathInput(path: string): Promise<void> {
        await this.inputFolderPathContainerInput.fill(path);
    }

    private async getTableListItemByTextContent(
        expectedTableTextContent: string,
    ): Promise<Locator | undefined> {
        const tables: Locator[] = await this.tableListItem.all();
        for (const table of tables) {
            if ((await table.textContent()) === expectedTableTextContent) return table;
        }
    }

    private getUploadedFileRowByFileName(file: string): Locator {
        return this.uploadedFileRow.filter({
            has: this.uploadedFileName.getByText(file, { exact: true }).first(),
        });
    }
}
