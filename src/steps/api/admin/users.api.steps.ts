import test, { expect, Page } from '@playwright/test';
import { UserContext } from '@config/UserContext';
import { AuthenticationV1 } from '@controllers/v1_0/authentication';

export class UsersAPISteps {

    /**
   * Logs in the user via API into a browser context
   * @param page - [browser context]{@link page.context} with the current page
   * @param userContext - user that makes the API call
   */
    static async userLogIn(page: Page, userContext: UserContext): Promise<void> {
        await test.step(`User '${userContext.email}' logged in via API`, async () => {
            await page.context().clearCookies();
            const res = await AuthenticationV1.postLoginViaUI(page.request, userContext);
            expect(res.status()).toBe(200);
        });
    }

}