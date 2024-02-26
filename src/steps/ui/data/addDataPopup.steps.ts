import { BrowserSteps } from '@steps/ui/browser.steps';
import test, { Page } from '@playwright/test';
import { AddDataPopup } from '@pages/data/addDataPopup';
import { DbType } from '@constants/dbType';
import { getDbConfig, getStringValue } from '@config/db.config';
import { ElementState } from '@constants/elementState';

export class AddDataPopupSteps extends BrowserSteps {
    constructor(page: Page, private addDataPopup = new AddDataPopup(page)) {
        super(page);
    }

    /**
     * Clicks a connector by its name
     * @param connectorName - connector's name in UI
     */
    clickConnectorByText = async (connectorName: string): Promise<void> => {
        await test.step(`Click '${connectorName}' connector on 'Select Provider' frame on 'Add Data' popup`, async () => {
            await this.addDataPopup.clickConnectorByText(connectorName);
            await this.addDataPopup.waitPageIsLoaded();
        });
    };

    /**
     * Types db host property into Location input for database
     * @param dbType - database type; ORACLE, SQL etc.
     */
    typeLocationForDatabase = async (dbType: DbType): Promise<void> => {
        await test.step(`Type 'Location' for '${dbType}' database on 'Add Data' popup`, async () => {
            const value = getStringValue(getDbConfig(dbType).host);
            await this.addDataPopup.typeIntoLocationInputField(value);
        });
    };

    /**
     * Types db user property into Username input for known databases
     * @param dbType - database type; ORACLE, SQL etc.
     */
    typeUserNameForDatabase = async (dbType: DbType): Promise<void> => {
        await test.step(`Type 'User Name' for '${dbType}' database on 'Add Data' popup`, async () => {
            const value = getStringValue(getDbConfig(dbType).user);
            await this.addDataPopup.typeIntoUserNameInputField(value);
        });
    };

    /**
     * Types db password property into Password input for known databases
     * @param dbType - database type; ORACLE, SQL etc.
     */
    typePasswordForDatabase = async (dbType: DbType): Promise<void> => {
        await test.step(`Type 'Password' for '${dbType}' database on 'Add Data' popup`, async () => {
            let value: string;
            if (dbType == DbType.SNOWFLAKE) {
                value = getStringValue(getDbConfig(dbType).passwordConnector);
            } else {
                value = getStringValue(getDbConfig(dbType).password);
            }
            await this.addDataPopup.typeIntoPasswordInputField(value);
        });
    };

    /**
     * Clicks 'Next' or 'Done' button
     */
    clickNextOrDoneButton = async (): Promise<void> => {
        await test.step(`Click 'Next/Done' button on 'Add Data' popup`, async () => {
            await this.addDataPopup.clickNextOrDoneButton();
        });
    };

    /**
     * Searches and selects database from databases list
     * @param database - database name
     */
    searchAndSelectDatabase = async (database: string): Promise<void> => {
        await test.step(`Search and select '${database}' database on 'Add Data' popup`, async () => {
            await this.addDataPopup.waitDatabaseListItemHasState(ElementState.VISIBLE);
            await this.addDataPopup.clickSearchLoop();
            await this.addDataPopup.typeIntoSearchInput(database);
            await this.addDataPopup.clickDatabaseByText(database);
        });
    };

    /**
  * Searches and select tables from tables list
  * @param tables - tables name
  * @param schema - schema name
  */
    searchAndSelectTables = async (tables: string[], schema?: string): Promise<void> => {
        await test.step(`Search and select '${tables.join()}' tables ${schema ? `from '${schema}' schema` : ''
            } on 'Add Data' popup`, async () => {
                await this.addDataPopup.waitTableListItemHasState(ElementState.VISIBLE);
                await this.addDataPopup.clickSearchLoop();
                for (const table of tables) {
                    await this.addDataPopup.typeIntoSearchInput(schema ? `${schema}.${table}` : table);
                    await this.addDataPopup.setTableCheckboxSelectionState(table, true);
                }
            });
    };

    /**
     * Verifies the popup visibility state
     * @param state         - expected visibility state (VISIBLE, HIDDEN etc.)
     * @param timeoutSec    - timeout in seconds (optional)
     */
    verifyPopupVisibilityState = async (state: ElementState, timeoutSec?: number) => {
        await test.step(`Verify 'Add Data' popup is '${state}'`, async () => {
            await this.addDataPopup.waitPopupVisibilityState(state, timeoutSec);
        });
    };
}