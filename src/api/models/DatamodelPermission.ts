import { DatamodelPermissionOption } from '@constants/datamodelPermissionOption';
import { PermissionType } from '@constants/permissionType';

export interface DatamodelPermission {
    partyId: string;
    permission: DatamodelPermissionOption;
    type: PermissionType;
}

// used for steps with setting name of user/group
export interface DatamodelPermissionByUserGroupName {
    userGroupName: string;
    permission: DatamodelPermissionOption;
    type: PermissionType;
}
