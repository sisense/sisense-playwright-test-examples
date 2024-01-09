import { test as base, Fixtures } from '@playwright/test';
import {
    PagesContextFixture,
    pagesContextFixture,
    PagesFixture,
    pagesFixture,
} from '@fixtures/pages.fixtures';
import { UserContextFixture, userFixture } from '@fixtures/userContext.fixture';

const combineFixtures = (...args: Fixtures[]): Fixtures =>
    args.reduce((acc, fixture) => ({ ...acc, ...fixture }), {});

export const sisenseTest = base.extend<PagesFixture & UserContextFixture & PagesContextFixture>(
    combineFixtures(pagesFixture, userFixture, pagesContextFixture),
);

export { expect } from '@playwright/test';
