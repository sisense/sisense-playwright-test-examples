import { BasePage } from '@pages/basePage';
import { Locator, Page } from '@playwright/test';
import { UserContext } from '@config/UserContext';
import { ElementState } from '@constants/elementState';

export class PulsePage extends BasePage {
    constructor(
        page: Page,
        private urlSuffix: string = 'app/main/pulse',
        private mainContainer: Locator = page.locator(`div.alerts-main-container-content`),
        private pulseAlertContainer: Locator = mainContainer.locator(
            `div.pulse-tile-container:has(div)`,
        ),
        private pulseAlertHeader: Locator = page.locator(`div.pulse-tile-header`),
        private pulseAlertTitle: Locator = page.locator(`div.pulse-tile-header-title`),
        private pulseAlertBody: Locator = page.locator(`div.pulse-tile-content-body`),
        private pulseBodyError: Locator = page.locator(`div.widget-error-notify-holder`),
    ) {
        super(page);
    }

    async waitPulsePageOpened(): Promise<void> {
        await this.mainContainer.waitFor({ timeout: 20 * 1000 });
    }

    async getPulseAlertsTitlesText(): Promise<string[]> {
        return this.pulseAlertTitle.allInnerTexts();
    }

    async getPulseAlertBodyText(title: string): Promise<string> {
        const targetContainer: Locator = this.getPulseAlertContainerLocator(title);
        const rawBodyText: string = await targetContainer.locator(this.pulseAlertBody).innerText();
        return rawBodyText.replace(/\n/g, ' ');
    }

    async openPulsePageByUrl(userContext: UserContext): Promise<void> {
        await this.openByPartURL(this.urlSuffix, userContext);
    }

    async waitPulseErrorVisibilityState(title: string, state: ElementState): Promise<void> {
        const pulseContainer: Locator = this.getPulseAlertContainerLocator(title);
        await pulseContainer.locator(this.pulseBodyError).waitFor({ state });
    }

    private getPulseAlertContainerLocator(title: string): Locator {
        return this.mainContainer.filter({
            has: this.pulseAlertTitle.getByText(title, { exact: true }),
        });
    }
}
