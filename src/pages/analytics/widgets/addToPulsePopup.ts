import { BasePage } from '@pages/basePage';
import { Locator, Page } from '@playwright/test';
import { ElementState } from '@constants/elementState';
import { PulseConditionType } from '@constants/pulseConditionType';
import { ThresholdConditionMenuItem } from '@constants/thresholdConditionMenuItem';

export class AddToPulsePopup extends BasePage {
    constructor(
        page: Page,
        private popup: Locator = page.locator(`div.add-pulse-wizard-container`),
        private popupHosts: Locator = page.locator(`div.add-pulse-host`),
        private nameInput: Locator = popup.locator(`input.alert-name-input`),
        private conditionalFormatterContainer: Locator = popup.locator(
            `div.add-pulse-settings-condition-formatter`,
        ),
        private popupHostsAddPulseModalContainer: Locator = popupHosts.locator(
            `div.add-pulse-modal-container`,
        ),
        private conditionalFormatterInput: Locator = conditionalFormatterContainer.locator(`input`),
        private conditionType: Locator = popup.locator(`div.condition-type-caption`),
        private alertFrequencyContainer: Locator = popup.locator(`div.schedule-formatter`),
        private alertFrequencyInput: Locator = alertFrequencyContainer.locator(`input`),
        private alertFrequencyDropdown: Locator = alertFrequencyContainer.locator(
            `div.condition-drop`,
        ),
        private dropdownItem: Locator = page.locator('div.drop-item'),
        private addButton: Locator = popup.locator(`button.btn-ok`),
        private addAdvancedButton: Locator = popupHostsAddPulseModalContainer.locator(
            `button.btn.add-pulse-modal-button.btn-ok`,
        ),
        private advancedBasicLink: Locator = popup.locator(`div.sb-action1.slf-text-href.link`),
        private pulseUsersTabButton: Locator = popupHosts.locator(
            `li.add-pulse-tab.add-pulse-tab-users`,
        ),
        private thresholdConditionDropdown: Locator = popup.locator(`div.tip-drop-down-menu-host`),
        private thresholdConditionMenuItem: Locator = page.locator(`data-menu div.mi-caption`),
        private betweenLeftOperandInput: Locator = popup.locator(
            `div[data-max="selectedCondition.value.leftOperand"] input`,
        ),
        private betweenRightOperandInput: Locator = popup.locator(
            `div[data-min="selectedCondition.value.rightOperand"] input`,
        ),
    ) {
        super(page);
    }

    async waitPopupVisibilityState(state: ElementState): Promise<void> {
        await this.popup.waitFor({ state });
    }

    async typeIntoNameInput(alertName: string): Promise<void> {
        await this.nameInput.fill(alertName);
    }

    async typeIntoConditionalFormatterInput(value: string): Promise<void> {
        //"click" is added prior to "fill": for step stability
        await this.conditionalFormatterInput.click();
        await this.conditionalFormatterInput.fill(value);
    }

    async clickConditionTypeByText(conditionType: PulseConditionType | string): Promise<void> {
        await this.conditionType.getByText(conditionType, { exact: true }).click();
    }

    async typeIntoAlertFrequencyInput(value: string): Promise<void> {
        await this.alertFrequencyInput.fill(value);
    }

    async clickAlertFrequencyDropdown(): Promise<void> {
        await this.alertFrequencyDropdown.click();
    }

    async clickDropdownItemByText(itemText: string): Promise<void> {
        await this.dropdownItem.getByText(itemText).click();
    }

    async clickAddButton(): Promise<void> {
        await this.addButton.click();
    }

    async clickAddAdvancedButton(): Promise<void> {
        await this.addAdvancedButton.click();
    }

    async clickAdvancedBasicLink(): Promise<void> {
        await this.advancedBasicLink.click();
    }

    async clickUsersTabButton(): Promise<void> {
        await this.pulseUsersTabButton.click();
    }

    async clickThresholdConditionDropdown(): Promise<void> {
        await this.thresholdConditionDropdown.click();
    }

    async clickThresholdConditionMenuItem(
        item: ThresholdConditionMenuItem | string,
    ): Promise<void> {
        await this.thresholdConditionMenuItem.getByText(item, { exact: true }).click();
    }

    async typeIntoBetweenLeftOperandInput(value: number): Promise<void> {
        await this.betweenLeftOperandInput.click();
        await this.betweenLeftOperandInput.fill(value.toString());
    }

    async typeIntoBetweenRightOperandInput(value: number): Promise<void> {
        await this.betweenRightOperandInput.click();
        await this.betweenRightOperandInput.fill(value.toString());
    }
}
