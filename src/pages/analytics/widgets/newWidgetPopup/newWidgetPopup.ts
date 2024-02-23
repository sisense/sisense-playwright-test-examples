import { BasePage } from '@pages/basePage';
import { Locator, Page } from '@playwright/test';
import { ElementState } from '@constants/elementState';
import { WidgetType } from '@constants/widgetType';
import { Constants } from '@constants/constants';

export class NewWidgetPopup extends BasePage {
    constructor(
        page: Page,
        private popup: Locator = page.locator(`div.new-widget-modal`),
        private selectDataButton: Locator = popup.locator(`button.select-btn.btn.js--add-item`),
        private createButton: Locator = popup.locator(`div.new-widget-footer button.js--btn-ok`),
        private widgetTitleInput: Locator = popup.locator(`div.widget-title input`),
        private addMoreDataButton: Locator = popup.locator(`button.add-btn`),
        private datasourceNameText: Locator = popup.locator(`div.datasource-name-text`),
        private widgetBody: Locator = popup.locator(`[class^='widget-body']`),
        private widgetIcon: Locator = popup.locator('div[data-widget-type]'),
    ) {
        super(page);
    }

    async getDatasourceNameText(): Promise<string> {
        return this.datasourceNameText.innerText();
    }

    async clickSelectDataButton(): Promise<void> {
        await this.selectDataButton.click();
    }

    async clickCreateButton(): Promise<void> {
        await this.createButton.click();
    }

    async waitCreateButtonState(state: ElementState): Promise<void> {
        await this.createButton.waitFor({ state });
    }

    async clickAddMoreDataButton(): Promise<void> {
        await this.addMoreDataButton.click();
    }

    async typeWidgetTitle(title: string): Promise<void> {
        await this.widgetTitleInput.fill(title);
    }

    async waitWidgetBodyHasState(state: ElementState): Promise<void> {
        await this.widgetBody.waitFor({ state });
    }

    async clickOnWidgetTypeIcon(widget: WidgetType): Promise<void> {
        const widgetIcon: Locator = await this.getTargetWidgetTypeIcon(widget);
        await widgetIcon.click();
    }

    private async getTargetWidgetTypeIcon(widgetType: WidgetType): Promise<Locator> {
        const widgetIcons: Locator[] = await this.widgetIcon.all();
        for (const widgetIcon of widgetIcons) {
            const attribute: string | null = await widgetIcon.getAttribute(
                Constants.DATA_WIDGET_TYPE,
            );
            if (attribute === widgetType) {
                return widgetIcon;
            }
        }
        throw new Error(`Target widget icon with '${widgetType}' widget type not found`);
    }
}