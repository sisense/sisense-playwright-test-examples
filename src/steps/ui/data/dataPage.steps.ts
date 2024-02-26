import test, { expect, Page } from '@playwright/test';
import { BrowserSteps } from '@steps/ui/browser.steps';
import { DataPage } from '@pages/data/dataPage';
import { UserContext } from '@config/UserContext';

export class DataPageSteps extends BrowserSteps {
    constructor(page: Page, private dataPage = new DataPage(page)) {
        super(page);
    }

    /**
     * Opens the Data page by URL
     * @param userContext - user to get correct BaseURL
     */
    openDataPageByUrl = async (userContext: UserContext): Promise<void> => {
        await test.step(`Open 'Data' page by URL`, async () => {
            await this.dataPage.openByUrl(userContext);
        });
    };

    /**
     * Searches datasource and clicks the one in data source table after search filter
     * @param dataModelName - name of the datamodel
     */
    searchAndOpenDataModelByName = async (dataModelName: string): Promise<void> => {
        await test.step(`Search and open '${dataModelName}' data model in 'List' view on 'Data' page`, async () => {
            await this.dataPage.typeIntoSearchField(dataModelName);
            await this.dataPage.clickDataModelByName(dataModelName);
            await this.dataPage.waitPageIsLoaded();
        });
    };

    /**
     * Creates a new ElastiCube or Live Data Model with certain name
     * @param modelType     - type of new model: 'ElastiCube' | 'Live'
     * @param modelName     - name of new data model
     */
    createDataModelWithName = async (
        modelType: 'ElastiCube' | 'Live',
        modelName: string,
    ): Promise<void> => {
        await test.step(`Create '${modelType}' model with '${modelName}' name on 'Data' page`, async () => {
            const buttonText = modelType == 'ElastiCube' ? '+ ElastiCube' : '+ Live';
            await this.dataPage.clickButtonByText(buttonText);
            await this.dataPage.typeIntoAddCubeModalInput(modelName);
            await this.dataPage.clickButtonOnAddCubePopup('Save');
        });
    };
}