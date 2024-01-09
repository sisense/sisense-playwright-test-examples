import { Fixtures } from '@playwright/test';
import { UserContext, defaultUserContext } from '@config/UserContext';

// Declare the types of your fixtures.
export type UserContextFixture = {
    userContext: UserContext;
};

export const userFixture: Fixtures<UserContextFixture> = {
    userContext: [defaultUserContext, { option: true }],
};

export { expect } from '@playwright/test';
