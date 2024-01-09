import { Locator, Page } from '@playwright/test';
import { BasePage } from '../basePage';
import { ElementState } from '@constants/elementState';

export class LoginPage extends BasePage {
    constructor(
        page: Page,
        private usernameField: Locator = page.getByPlaceholder('Username/Email'),
        private passwordField: Locator = page.getByPlaceholder('Password'),
        private loginButton: Locator = page.getByRole('button', { name: 'Login' }),
        private error: Locator = page.locator(`div.error`),
        private forgotPasswordLink: Locator = page.locator(`a[href="account/forgotpass"]`),
    ) {
        super(page);
    }

    async openLoginPage(loginPageUrl: string): Promise<void> {
        await this.openURL(loginPageUrl);
    }

    async fillUsername(username: string): Promise<void> {
        await this.usernameField.fill(username);
    }

    async fillPassword(password: string): Promise<void> {
        await this.passwordField.fill(password);
    }

    async clickLoginButton(): Promise<void> {
        await this.loginButton.click();
    }

    async waitForLoginPageOpened(): Promise<void> {
        await this.usernameField.waitFor({ state: ElementState.VISIBLE });
    }

    async getErrorText(): Promise<string> {
        return this.error.innerText();
    }

    async clickForgotPasswordLink(): Promise<void> {
        await this.forgotPasswordLink.click();
    }
}
