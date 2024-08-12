import { BrowserSteps } from '@steps/ui/browser.steps';
import test, { expect, Page } from '@playwright/test';
import { NewWidgetPopup } from '@pages/analytics/widgets/newWidgetPopup/newWidgetPopup';
import { ElementState } from '@constants/elementState';
import { WidgetType } from '@constants/widgetType';

export class NewWidgetPopupSteps extends BrowserSteps {
    constructor(page: Page, private newWidgetPopup = new NewWidgetPopup(page)) {
        super(page);
    }

    /**
     * Verifies data source title equals expected one
     * @param text - expected title text
     */
    verifyDataSourceTitleTextToBe = async (text: string): Promise<void> => {
        await test.step(`Verify Data Source title to be '${text}' on 'New Widget' popup`, async () => {
            await expect
                .poll(async () => {
                return this.newWidgetPopup.getDatasourceNameText();
                },{
                    message: `Data source title is different from expected`
                    },)
                .toEqual(text);
        });
    };

    /**
     * Clicks 'Select Data' button (despite its text in UI)
     */
    clickSelectDataButton = async (): Promise<void> => {
        await test.step(`Click 'Select Data' button on 'New Widget' popup`, async () => {
            await this.newWidgetPopup.clickSelectDataButton();
        });
    };

    /**
     * Clicks 'Add More Data' button (despite its text in UI)
     */
    clickAddMoreDataButton = async (): Promise<void> => {
        await test.step(`Click 'Add More Data' button on 'New Widget' popup`, async () => {
            await this.newWidgetPopup.clickAddMoreDataButton();
        });
    };

    /**
     * Types title for new widget
     * @param title - new title of the widget to be set
     */
    typeWidgetTitle = async (title: string): Promise<void> => {
        await test.step(`Type '${title}' title for widget on 'New Widget' popup`, async () => {
            await this.newWidgetPopup.typeWidgetTitle(title);
        });
    };

    /**
     * Verifies widget body has expected visibility state
     * @param state - visibility state (VISIBLE, HIDDEN etc.)
     */
    verifyWidgetBodyHasVisibilityState = async (state: ElementState): Promise<void> => {
        await test.step(`Verify widget body has '${state}' state on 'New Widget' popup`, async () => {
            await this.newWidgetPopup.waitWidgetBodyHasState(state);
        });
    };

    /**
     * Click widget type icon on new widget popup
     * @param widgetType - new widget type
     */
    clickWidgetTypeIcon = async (widgetType: WidgetType): Promise<void> => {
        await test.step(`Click '${widgetType}' widget type on 'New Widget' popup`, async () => {
            await this.newWidgetPopup.clickOnWidgetTypeIcon(widgetType);
        });
    };

    /**
     * Clicks 'Create' button (despite its text in UI)
     */
    clickCreateButton = async (): Promise<void> => {
        await test.step(`Click 'Create' button on 'New Widget' popup`, async () => {
            await this.newWidgetPopup.clickCreateButton();
            await this.newWidgetPopup.waitCreateButtonState(ElementState.HIDDEN);
        });
    };
}    