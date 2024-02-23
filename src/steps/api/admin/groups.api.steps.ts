import test, { expect } from '@playwright/test';
import { UserContext } from '@config/UserContext';
import { Group } from '@models/Group';
import { GroupsV09 } from '@controllers/v0_9/groups';

export class GroupsAPISteps {
    /**
     * Gets group Id by name
     * @param groupName - group name
     * @param userContext - user that makes the API call
     * @returns - group Id
     */
    static async getGroupIdByName(groupName: string, userContext: UserContext): Promise<string> {
        return test.step(`Get ID of '${groupName}' group by '${userContext.email}' via API`, async () => {
            const group: Group = await this.getGroupByName(groupName, userContext);
            return group._id!;
        });
    }

    /**
     * Gets group object by name
     * @param groupName - group name
     * @param userContext - user that makes the API call
     * @returns Group object
     * @private
     */
    private static async getGroupByName(
        groupName: string,
        userContext: UserContext,
    ): Promise<Group> {
        return test.step(`Get '${groupName}' group by '${userContext.email}' via API`, async () => {
            const response = await GroupsV09.getGroupsByNameOrId(groupName, userContext);
            expect(response.status()).toBe(200);
            return response.json();
        });
    }
}