import { BrowserSteps } from '@steps/ui/browser.steps';
import test, { Page } from '@playwright/test';
import { AnalyticsDimensionsPopup } from '@pages/analytics/analyticsDimensionsPopup';
import { AggregationType } from '@constants/aggregationType';

export class AnalyticsDimensionsPopupSteps extends BrowserSteps {
    constructor(page: Page, private analyticsDimensionsPopup = new AnalyticsDimensionsPopup(page)) {
        super(page);
    }

    /**
     * Adds column from table with default or specific aggregation type
     * use [aggregationType] param is not default aggregation is needed (ALL ITEMS, AVERAGE, MEDIAN etc.)
     * @param column            - data model column name
     * @param table             - data model table name
     * @param aggregationType   - aggregation type the field (column) should be added with (All Items, Count Unique etc.)
     */
    addColumnFromTable = async (
        column: string,
        table: string,
        aggregationType?: AggregationType | string,
    ): Promise<void> => {
        await test.step(`Add '${column}' column from '${table}' table${aggregationType ? ` with '${aggregationType}' aggregation type` : ``
            } on 'Analytics Dimensions' popup`, async () => {
                await this.analyticsDimensionsPopup.waitDimensionsArePresent();
                if (!aggregationType) {
                    await this.analyticsDimensionsPopup.clickColumnFromTable(column, table);
                } else {
                    await this.analyticsDimensionsPopup.hoverOverColumnFromTable(column, table);
                    await this.analyticsDimensionsPopup.clickMoreButtonForColumnFromTable(
                        column,
                        table,
                    );
                    await this.analyticsDimensionsPopup.clickAggregationMenuItem(aggregationType!);
                }
            });
    };
}
