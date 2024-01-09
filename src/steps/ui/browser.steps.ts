import { BasePage } from '@pages/basePage';
import test, { expect, Page } from '@playwright/test';
import { UserContext } from '@config/UserContext';

export class BrowserSteps {
    constructor(protected page: Page, private basePage = new BasePage(page)) { }

    /**
   * Reloads the current page and waits it's loaded
   */
    reloadPage = async (): Promise<void> => {
        await test.step('Reload current page', async () => {
            await this.basePage.reload();
        });
    };

    /**
     * Opens a page by provided URL on the current page and waits it's loaded
     * @param url
     */
    openPageByURL = async (url: string): Promise<void> => {
        await test.step(`Open page by URL '${url}'`, async () => {
            await this.basePage.openURL(url);
        });
    };

    /**
     * Verifies the page's URL matches the expected one
     * @param expectedURL - expected URL
     */
    verifyPageURLEquals = async (expectedURL: string): Promise<void> => {
        await test.step(`Verify page URL is '${expectedURL}'`, async () => {
            const currentPageURL = this.basePage.getPageURL();
            expect(currentPageURL).toEqual(expectedURL);
        });
    };

    /**
     * Verifies the page URL contains expected part
     * @param partURL - expected part of the URL
     */
    verifyPageURLContains = async (partURL: string) => {
        await test.step(`Verify page URL contains '${partURL}'`, async () => {
            await expect(async () => {
                const currentPageURL = this.basePage.getPageURL();
                expect(currentPageURL).toContain(partURL);
            }).toPass({
                timeout: 5 * 1000,
            });
        });
    };

    /**
     * Gets current page URL
     */
    getPageURL = async (): Promise<string> => {
        return test.step(`Get current page URL`, async () => {
            return this.basePage.getPageURL();
        });
    };

    /**
     * Verifies the page title matches the expected one
     * @param expectedTitle - expected page title
     */
    verifyPageTitleIs = async (expectedTitle: string) => {
        await test.step(`Verify page title is '${expectedTitle}'`, async () => {
            const currentPageTitle = await this.basePage.getPageTitle();
            expect(currentPageTitle).toEqual(expectedTitle);
        });
    };

    /**
     * Verifies the page is loaded (both Network + DOM)
     */
    verifyPageIsLoaded = async () => {
        await test.step(`Verify the page is loaded`, async () => {
            await this.basePage.waitPageIsLoaded();
        });
    };

    /**
    * Opens a page by part URL on the current page
    * @param urlSuffix        - path of the URL that is added after BaseURL
    * @param userContext      - user to get correct BaseURL
    * @param waitPageIsLoaded - wait for page to load
    */
    openPageByPartURL = async (
        urlSuffix: string,
        userContext: UserContext,
        waitPageIsLoaded?: boolean,
    ): Promise<void> => {
        await test.step(`Open page by part URL '${urlSuffix}'`, async () => {
            await this.basePage.openByPartURL(urlSuffix, userContext, waitPageIsLoaded);
        });
    };
}