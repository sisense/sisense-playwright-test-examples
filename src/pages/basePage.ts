import { Cookie, expect, Locator, Page, Request, Response } from '@playwright/test';
import { UserContext } from '@config/UserContext';
import console from 'console';
import { downloadFileFromArtifactory } from '@utils/artifactoryUtils';
import { getFilePassInArtifactsFolder } from '@utils/fileUtils';

export let resourceResponses: Response[] = [];
export let browserConsoleErrors: string[] = [];

export function resetResourceResponses() {
    resourceResponses = [];
}

export class BasePage {
    constructor(
        protected page: Page,
        private inputTypeFile: Locator = page.locator(`input[type='file']`),
    ) { }

    async openURL(url: string): Promise<this> {
        await this.page.goto(url);
        await this.waitPageIsLoaded();
        return this;
    }

    async openByPartURL(
        urlSuffix: string,
        userContext: UserContext,
        waitPageIsLoaded: boolean = true,
    ): Promise<void> {
        await this.page.goto(userContext.baseUrl + urlSuffix);
        if (waitPageIsLoaded) await this.waitPageIsLoaded(2 * 60);
    }

    async reload(): Promise<void> {
        await this.page.reload();
        await this.waitPageIsLoaded();
    }

    async openBaseURL(userContext: UserContext): Promise<void> {
        await this.page.goto(userContext.baseUrl);
        await this.waitPageIsLoaded();
    }

    getPageURL(): string {
        return this.page.url();
    }

    async getPageTitle(): Promise<string> {
        return this.page.title();
    }

    async waitPageIsLoaded(timeoutSec: number = 30): Promise<void> {
        await this.page.waitForLoadState('networkidle', { timeout: timeoutSec * 1000 });
    }

    /**
     * Returns page cookies as array
     */
    async getPageCookies(): Promise<Cookie[]> {
        return this.page.context().cookies();
    }

    /**
     * Monitor page for specific URL call
     * @param url
     * @param timeoutSec
     */
    async getResponseByUrl(url: string, timeoutSec: number = 30): Promise<Response> {
        return this.page.waitForResponse(`**/${url}`, {
            timeout: timeoutSec * 1000,
        });
    }

    /**
     * Moves mouse from the current position on provided pixels (negative values are allowed)
     * @param x - pixels to move right
     * @param y - pixels to move up
     */
    async mouseMove(x: number, y: number): Promise<void> {
        await this.page.mouse.move(x, y);
    }

    /**
     * Starts collecting all network resources and save them in global variable 'resourceResponses'
     * Do not use more than one time per browser session unless resources are duplicated for each step usage!
     * */
    async startCollectingAllNetworkResources(): Promise<void> {
        this.page.on('response', async (response) => {
            resourceResponses.push(response);
        });
    }

    loggingFailedRequests(): void {
        this.page.on('requestfailed', (failedReq: Request) => {
            console.log(
                `WARNING. Request has been failed:\n${failedReq.method()} ${failedReq.url()}`,
            );
        });
    }

    async startCollectingBrowserConsoleErrors(): Promise<void> {
        this.page.on('pageerror', async (exception) => {
            return browserConsoleErrors.push(exception.message);
        });
        this.page.on('console', async (message) => {
            if (message.type() === 'error') {
                browserConsoleErrors.push(message.text());
            }
        });
    }

    async pressButton(
        key: string,
        options?: { delay?: number | undefined } | undefined,
    ): Promise<void> {
        await this.page.keyboard.press(key, options);
    }

    async waitElementEnabledState(
        locator: Locator,
        enabled: boolean,
        timeoutSec?: number,
    ): Promise<void> {
        await expect(locator).toBeEnabled({
            enabled,
            timeout: timeoutSec ? timeoutSec * 1000 : undefined,
        });
    }

    /**
     * Downloads the file from the Artifactory and uploads it into the default input locator input[type='file']
     * Custom input locator can be defined as second (optional) parameter if the default input locator isn't match your case
     * @param fileName  - name of the file to upload
     * @param locator   - (optional) your custom locator if needed
     */
    async uploadFile(fileName: string, locator?: Locator): Promise<void> {
        locator = locator || this.inputTypeFile;
        await downloadFileFromArtifactory(fileName);
        const filePath: string = getFilePassInArtifactsFolder(fileName);
        await locator.setInputFiles(filePath, { timeout: 2 * 60 * 1000 });
    }
}
