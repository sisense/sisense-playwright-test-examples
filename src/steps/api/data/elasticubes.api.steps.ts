import { UserContext } from '@config/UserContext';
import {
    DatamodelPermission,
    DatamodelPermissionByUserGroupName,
} from '@models/DatamodelPermission';
import test, { APIResponse, expect } from '@playwright/test';
import console from 'console';
import { Elasticubes } from '@controllers/v0_9/elasticubes';
import { PermissionType } from '@constants/permissionType';
import { GroupsAPISteps } from '@steps/api/admin/groups.api.steps';
import { UsersAPISteps } from '@steps/api/admin/users.api.steps';

export class ElasticubesAPISteps {

    /**
     * Shares a datamodel with provided permissions
     * @param elasticubePermissionsByUserGroupName - elasticube permission object with group and user names instead of partyId {@link DatamodelPermission}
     * @param elasticubeTitle - elasticube title
     * @param userContext     - user that makes the API call
     * @param server          - (optional) server
     */
    static async shareElasticube(
        elasticubePermissionsByUserGroupName: DatamodelPermissionByUserGroupName[],
        elasticubeTitle: string,
        userContext: UserContext,
        server: string = 'localhost',
    ): Promise<void> {
        await test.step(`Share '${elasticubeTitle}' elasticube at '${server}' server by '${userContext.email}' via API`, async (): Promise<void> => {
            const elasticubePermissions: DatamodelPermission[] = await this.getPermissionsBody(
                elasticubePermissionsByUserGroupName,
                userContext,
            );
            const response: APIResponse = await Elasticubes.putElasticubesPermissionsByTitleOrId(
                elasticubeTitle,
                elasticubePermissions,
                userContext,
                server,
            );
            expect(response.status()).toBe(200);
            console.log(`Elasticube '${elasticubeTitle}' is shared`);
        });
    }

    /**
     * Gets permissions array object with user/groups ids
     * @param permissionsByUserGroupName - model permissions object with group and user names instead of partyId {@link DatamodelPermission}
     * @param userContext - user that makes the API call
     * @returns datamodel permissions array object
     */
    private static async getPermissionsBody(
        permissionsByUserGroupName: DatamodelPermissionByUserGroupName[],
        userContext: UserContext,
    ): Promise<DatamodelPermission[]> {
        let permissions: DatamodelPermission[] = [];
        for (const permission of permissionsByUserGroupName) {
            let partyId: string = '';
            if (permission.type === PermissionType.GROUP) {
                partyId = await GroupsAPISteps.getGroupIdByName(
                    permission.userGroupName,
                    userContext,
                );
            } else if (permission.type === PermissionType.USER) {
                partyId = await UsersAPISteps.getUserIdByName(
                    permission.userGroupName,
                    userContext,
                );
            } else {
                throw new Error(`Neither group nor user is used for permission`);
            }
            permissions.push({
                partyId,
                permission: permission.permission,
                type: permission.type,
            });
        }
        return permissions;
    }
}