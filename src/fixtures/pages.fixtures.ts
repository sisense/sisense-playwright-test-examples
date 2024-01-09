import { Fixtures, Page, PlaywrightTestArgs } from '@playwright/test';
import { LoginPageSteps } from '@steps/ui/login/loginPage.steps';
import { BrowserSteps } from '@steps/ui/browser.steps';
import { DashboardPageSteps } from '@steps/ui/analytics/dashboard/dashboardPage.steps';
import { WidgetSteps } from '@steps/ui/analytics/widgets/widget.steps';
import { MenuPopupSteps } from '@steps/ui/analytics/menuPopup.steps';

export type PagesContextFixture = {
    contextPage: Page;
};

export type PagesFixture = {
    loginPageSteps: LoginPageSteps;
    browserSteps: BrowserSteps;
    dashboardPageSteps: DashboardPageSteps;
    widgetSteps: WidgetSteps;
    menuPopupSteps: MenuPopupSteps;
};

export const pagesContextFixture: Fixtures<PagesContextFixture & PlaywrightTestArgs> = {
    contextPage: async ({ page }, use) => {
        await use(page);
    },
};

export const pagesFixture: Fixtures<PagesFixture & PagesContextFixture> = {
    loginPageSteps: async ({ contextPage }, use) => {
        await use(new LoginPageSteps(contextPage));
    },
    browserSteps: async ({ contextPage }, use) => {
        await use(new BrowserSteps(contextPage));
    },
    dashboardPageSteps: async ({ contextPage }, use) => {
        await use(new DashboardPageSteps(contextPage));
    },
    widgetSteps: async ({ contextPage }, use) => {
        await use(new WidgetSteps(contextPage));
    },
    menuPopupSteps: async ({ contextPage }, use) => {
        await use(new MenuPopupSteps(contextPage));
    },
};