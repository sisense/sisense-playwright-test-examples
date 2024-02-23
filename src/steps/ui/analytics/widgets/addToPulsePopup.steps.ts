import { BrowserSteps } from '@steps/ui/browser.steps';
import test, { Page } from '@playwright/test';
import { AddToPulsePopup } from '@pages/analytics/widgets/addToPulsePopup';
import { AddToPulsePopupUsersTab } from '@pages/analytics/widgets/addToPulsePopupUsersTab';
import { PulseConditionType } from '@constants/pulseConditionType';
import { ElementState } from '@constants/elementState';

export class AddToPulsePopupSteps extends BrowserSteps {
    constructor(
        page: Page,
        private addToPulsePopup = new AddToPulsePopup(page),
        private addToPulsePopupUsersTab = new AddToPulsePopupUsersTab(page),
    ) {
        super(page);
    }

    /**
     * Clicks the Condition Type on 'Add to Pulse' popup
     * @param conditionType - condition type text (Threshold, Automatic, Always)
     */
    clickConditionType = async (conditionType: PulseConditionType | string): Promise<void> => {
        await test.step(`Click '${conditionType}' condition type on 'Add to Pulse' popup`, async () => {
            await this.addToPulsePopup.clickConditionTypeByText(conditionType);
        });
    };

    /**
     * Clicks 'Advanced/Basic' link on 'Add to Pulse' popup
     */
    clickAdvancedBasicLink = async (): Promise<void> => {
        await test.step(`Click 'Advanced/Basic' link on 'Add to Pulse' popup`, async (): Promise<void> => {
            await this.addToPulsePopup.clickAdvancedBasicLink();
        });
    };

    /**
     * Searches and adds users/groups to pulse list
     * @param usersGroups - list of users/groups to share the dashboard with
     */
    addUsersGroupsToPulseList = async (usersGroups: string[]): Promise<void> => {
        await test.step(`Add '${usersGroups.join(
            ', ',
        )}' users/groups to pulse list on 'Add to Pulse' popup`, async () => {
            await this.addToPulsePopup.clickUsersTabButton();
            for (const userGroup of usersGroups) {
                await this.addToPulsePopupUsersTab.typeIntoSearchInput(userGroup);
                await this.addToPulsePopupUsersTab.clickAutocompleteListItemByTitle(userGroup);
                await this.addToPulsePopupUsersTab.waitAddedUserGroupItemByTitleHasState(
                    userGroup,
                    ElementState.VISIBLE,
                );
            }
        });
    };

    /**
     * Clicks 'Add' button on 'Add to Pulse' advanced popup
     */
    clickAddAdvancedButton = async (): Promise<void> => {
        await test.step(`Click 'Add' button on 'Add to Pulse' advanced popup`, async (): Promise<void> => {
            await this.addToPulsePopup.clickAddAdvancedButton();
        });
    };
}