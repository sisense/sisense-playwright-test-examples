import { BasePage } from '@pages/basePage';
import { Locator, Page } from '@playwright/test';
import { AggregationType } from '@constants/aggregationType';

export class AnalyticsDimensionsPopup extends BasePage {
    constructor(
        page: Page,
        private popup: Locator = page.locator(`div[aria-label='popup']`),
        private dataBrowserTableContainer: Locator = popup.locator(
            `div[aria-label='dimlist-tableContainer']`,
        ),
        private dataBrowserTableName: Locator = page.locator(`div[aria-label='dimlist-tableName']`),
        private dataBrowserColumn: Locator = page.locator(`div[aria-label='dimlist-column']`),
        private dataBrowserColumnName: Locator = page.locator(`span.title`),
        private moreButton: Locator = page.locator(`span[aria-label='dimlist-column-moreButton']`),
        private moreMenuItem: Locator = page.locator(
            `div.menu-item:not(.mi-separator) div.mi-caption`,
        ),
    ) {
        super(page);
    }

    async waitDimensionsArePresent(): Promise<void> {
        await this.dataBrowserColumn.first().waitFor({ timeout: 30 * 1000 });
    }

    async clickColumnFromTable(column: string, table: string): Promise<void> {
        await this.getColumnFromTableLocator(column, table).click();
    }

    async hoverOverColumnFromTable(column: string, table: string): Promise<void> {
        await this.getColumnFromTableLocator(column, table).hover();
    }

    async clickMoreButtonForColumnFromTable(column: string, table: string): Promise<void> {
        const targetColumnRow: Locator = this.getColumnFromTableLocator(column, table);
        await targetColumnRow.locator(this.moreButton).click();
    }

    async clickAggregationMenuItem(itemText: AggregationType | string): Promise<void> {
        await this.moreMenuItem.getByText(itemText, { exact: true }).click();
    }

    private getColumnFromTableLocator(column: string, table: string): Locator {
        return this.dataBrowserTableContainer
            .filter({ has: this.dataBrowserTableName.getByText(table, { exact: true }) })
            .locator(
                this.dataBrowserColumn.filter({
                    has: this.dataBrowserColumnName.getByText(column, { exact: true }),
                }),
            );
    }
}