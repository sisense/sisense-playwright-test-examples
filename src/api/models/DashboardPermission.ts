import { DashboardPermissionRule } from '@constants/dashboardPermissionRule';
import { PermissionType } from '@constants/permissionType';
import { DashboardSharesSubscription } from './DashboardSharesSubscription';

export interface DashboardPermission {
    shareId: string;
    type: PermissionType;
    subscribe: boolean;
    rule?: DashboardPermissionRule;
}

export interface DashboardShares {
    sharesTo: DashboardPermission[];
    subscription?: DashboardSharesSubscription;
    allowChangeSubscription?: boolean;
    sharesToNew?: DashboardShareToNew[];
}

// used for steps with setting name of user/group
export interface DashboardPermissionByUserGroupName {
    userGroupName: string;
    type: PermissionType;
    subscribe: boolean;
    rule?: DashboardPermissionRule;
}

export interface DashboardShareData {
    permissions: DashboardPermissionByUserGroupName[];
    allowChangeSubscription?: boolean;
    subscription?: DashboardSharesSubscription;
    sharesToNew?: DashboardShareToNew[];
}

export interface DashboardShareToNew {
    email: string;
    rule?: DashboardPermissionRule;
    subscribe: boolean;
    tenantId?: string;
    type: PermissionType;
}
