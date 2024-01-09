import test, { Page } from '@playwright/test';
import { LoginPage } from '@pages/login/loginPage';
import { AnalyticsPage } from '@pages/analytics/analyticsPage';
import { BrowserSteps } from '@steps/ui/browser.steps';
import { UserContext } from '@config/UserContext';

export class LoginPageSteps extends BrowserSteps {
    constructor(
        page: Page,
        private analyticsPage: AnalyticsPage = new AnalyticsPage(page),
        private loginPage: LoginPage = new LoginPage(page),
    ) {
        super(page);
    }

    logIn = async (userContext: UserContext): Promise<void> => {
        await test.step(`Log in as '${userContext.email}' user`, async () => {
            await this.loginPage.openLoginPage(userContext.baseUrl);
            await this.loginPage.fillUsername(userContext.email);
            await this.loginPage.fillPassword(userContext.password);
            await this.loginPage.clickLoginButton();

            await this.analyticsPage.waitAnalyticsPageOpened();
        });
    };

    verifyLoginPageIsOpen = async (): Promise<void> => {
        await test.step(`Verify 'Login' page is open`, async () => {
            await this.loginPage.waitForLoginPageOpened();
        });
    };

    /**
     * Fills 'Username/Email' field with provided text
     * @param text - text to be filled in
     */
    typeTextIntoUsernameField = async (text: string): Promise<void> => {
        await test.step(`Type '${text}' into 'Username/Email' field on 'Login' page`, async () => {
            await this.loginPage.fillUsername(text);
        });
    };

    /**
     * Fills 'Password' field with provided text
     * @param text - text to be filled in
     */
    typeTextIntoPasswordField = async (text: string): Promise<void> => {
        await test.step(`Type '${text}' into 'Password' field on 'Login' page`, async () => {
            await this.loginPage.fillPassword(text);
        });
    };

    /**
     * Clicks 'Login' button
     */
    clickLoginButton = async (): Promise<void> => {
        await test.step(`Click 'Login' button on 'Login' page`, async () => {
            await this.loginPage.clickLoginButton();
        });
    };
}