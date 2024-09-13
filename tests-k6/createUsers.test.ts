import { group } from 'k6';
import { Trend } from 'k6/metrics';
import { RefinedResponse, ResponseType } from 'k6/http';
import { createUsers } from './steps/users.steps';
import { Options } from 'k6/options';
import { RoleDisplayName } from '../src/constants/roleDisplayName';
import { getRoleId } from './steps/roles.steps';
import { addUsersToGroup, createGroups, getGroupsBySearchName, getUsersFromGroup } from './steps/groups.steps';
import { getRandomItemFromArray, getRandomItemsFromArray } from './utils/arrayUtils';
import { RoleName } from '../src/constants/roleName';
import { defaultUserContext } from './config/UserContext';
import { login } from './steps/login.steps';

//Simple performance test with user and group creation in the setup and getting user and group in test.

let userContext = defaultUserContext;
const userName: string = 'sisense';
const groupName: string = 'sisense';
const usersTotalNumber: number = 40;
const usersInChunkNumber: number = 4;
const groupsTotalNumber: number = 20;
const groupsInChunkNumber: number = 2;
const usersInGroup: number = 2;
const searchGroupNumber: number = 2;
const getGroupsBySearchNameMetric = new Trend(
    'http_req_duration_custom_getGroupsBySearchName',
    true,
);
const getUsersFromGroupMetric = new Trend('http_req_duration_custom_getUsersFromGroup', true);

export let options: Options = {
    vus: 1,
    duration: '10s',
};

export function setup() {
    let groupIds: string[] = [];
    let userIds: string[] = [];

    group('SysAdmin Login', function () {
        return login(userContext);
    });

    group('Create users', function () {
        let viewerRoleID = getRoleId(userContext, RoleDisplayName.VIEWER);

        let users = createUsers(
            defaultUserContext,
            userName,
            viewerRoleID,
            usersTotalNumber,
            usersInChunkNumber,
        );

        userIds = users.map((i) => i[0]['_id']);
        console.log('USER IDS: ' + userIds);
    });

    group('Create groups', function () {
        const createGroupResp = createGroups(
            defaultUserContext,
            groupName,
            RoleName.VIEWER,
            groupsTotalNumber,
            groupsInChunkNumber,
        );

        groupIds = createGroupResp.map((i) => i[0]['_id']);
        console.log('GROUP IDS: ' + groupIds);
    });

    group('Add users to groups', function () {
        groupIds.forEach((i) => {
            // Add 'usersInGroup' number of random users to group
            const randomUsers = getRandomItemsFromArray(userIds, usersInGroup);
            addUsersToGroup(defaultUserContext, i, randomUsers);
        });
    });

    return { userContext, userIds, groupIds };
}

export default function (data: any) {
    let randomGroupID: string;

    group('Get groups by name ', function () {
        const resp = getGroupsBySearchName(data.userContext, groupName, searchGroupNumber);
        getGroupsBySearchNameMetric.add(resp.timings.duration);
    });

    group('Get users from group', function () {
        let usersFromGroupResponse: RefinedResponse<ResponseType | undefined>;
        randomGroupID = getRandomItemFromArray(data.groupIds);

        usersFromGroupResponse = getUsersFromGroup(data.userContext, randomGroupID);
        getUsersFromGroupMetric.add(usersFromGroupResponse.timings.duration);
    });
}