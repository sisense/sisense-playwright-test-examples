import { sleep } from 'k6';
import { LanguageCodeName } from '../../src/constants/languageCodeName';
import { RoleName } from '../../src/constants/roleName';
import http from 'k6/http';
import { checkResponse } from './verification.steps';
import { getParamsWithToken } from './login.steps';
import { UserContext } from '../config/UserContext';

export function createGroups(
    userContext: UserContext,
    groupNamePrefix: string,
    roleName: RoleName,
    groupsTotalNumber: number,
    groupsChunkNumber: number = groupsTotalNumber,
    timeout: number = 0,
) {
    let groupsResponse: any[] = [];
    const chunksNumber = Math.ceil(groupsTotalNumber / groupsChunkNumber);
    for (let i = 1; i <= chunksNumber; i++) {
        let groups = [];
        const groupNameChunk = `${groupNamePrefix}_chunk${i}`;
        const remainder = groupsTotalNumber % groupsChunkNumber;
        let groupsInChunk = i === chunksNumber && remainder !== 0 ? remainder : groupsChunkNumber;
        console.log(`Creating ${groupsInChunk} groups, iteration ${i} of ${chunksNumber}`);
        for (let j = 1; j <= groupsInChunk; j++) {
            const groupName = `${groupNameChunk}_group${j}`;
            const groupBody = createGroupBody(groupName, roleName);
            groups.push(groupBody);
        }
        const body = JSON.stringify(groups);
        const response = postGroupsV09(userContext, body);
        const responseJson = response.json();
        groupsResponse = groupsResponse.concat(responseJson);

        sleep(timeout);
    }
    return groupsResponse;
}

export function addUsersToGroup(
    userContext: UserContext,
    groupId: string,
    usersIds: string[],
    showLogsIfSuccess = false,
) {
    const body = JSON.stringify(usersIds);
    postGroupsUsersV09(userContext, groupId, body, showLogsIfSuccess);
    // console.log(`Added users to '${groupId}' group: '${usersIds}'.`);
    sleep(1);
}

function postGroupsV09(userContext: UserContext, body: string, showLogsIfSuccess = false) {
    const params = getParamsWithToken(userContext);
    const postGroups = http.post(userContext.baseUrl + `api/groups`, body, params);
    checkResponse(postGroups, 200, 'Create groups ', showLogsIfSuccess);
    return postGroups;
}

function postGroupsUsersV09(
    userContext: UserContext,
    groupId: string,
    body: string,
    showLogsIfSuccess = false,
) {
    const params = getParamsWithToken(userContext);
    const postGroupsUsers = http.post(
        userContext.baseUrl + `api/groups/${groupId}/users`,
        body,
        params,
    );
    checkResponse(postGroupsUsers, 200, 'Add users to group ', showLogsIfSuccess);
    return postGroupsUsers;
}

function createGroupBody(groupName: string, roleName: RoleName) {
    return {
        defaultRole: roleName,
        excludeFromSharing: false,
        language: LanguageCodeName.SYSTEM_LANGUAGE,
        name: groupName,
        timeout: 'default',
    };
}

export function deleteGroup(userContext: UserContext, groupId: string) {
    const params = getParamsWithToken(userContext);
    const deleteGroupResponse = http.del(
        userContext.baseUrl + 'api/groups/' + groupId,
        null,
        params,
    );
    checkResponse(deleteGroupResponse, 200, 'Delete group: ' + groupId);
}

export function getGroupsBySearchName(
    userContext: UserContext,
    groupName: string,
    limit: number = 10,
) {
    const params = getParamsWithToken(userContext);
    const groupResponse = http.get(
        `${userContext.baseUrl}api/groups?search=${groupName}&limit=${limit}`,
        params,
    );
    checkResponse(groupResponse, 200, 'Return all groups with name: ' + groupName);
    return groupResponse;
}

export function getUsersFromGroup(
    userContext: UserContext,
    groupId: string,
    showLogsIfSuccess = false,
) {
    const params = getParamsWithToken(userContext);
    const usersFromGroupResponse = http.get(
        userContext.baseUrl + `api/groups/${groupId}/users`,
        params,
    );
    checkResponse(
        usersFromGroupResponse,
        200,
        'Get all users from the group: ' + groupId,
        showLogsIfSuccess,
    );
    return usersFromGroupResponse;
}

export function deleteUserFromGroup(
    userContext: UserContext,
    groupId: string,
    userId: string,
    showLogsIfSuccess = false,
) {
    const params = getParamsWithToken(userContext);
    const removeUserFromGroupResp = http.del(
        userContext.baseUrl + `api/groups/${groupId}/users`,
        JSON.stringify([userId]),
        params,
    );
    checkResponse(removeUserFromGroupResp, 200, 'Remove users from group ', showLogsIfSuccess);
    return removeUserFromGroupResp;
}

/**
 * Gets group ID by groupName
 * @param userContext - user that makes the API call
 * @param groupName   - group name
 * returns group ID for specified group name
 */
export function getGroupIdByName(userContext: UserContext, groupName: string): string {
    const params = getParamsWithToken(userContext);
    const getGroupsResp = http.get(userContext.baseUrl + `/api/groups/${groupName}`, params);
    checkResponse(getGroupsResp, 200, `Get group '${groupName}'`);
    return getGroupsResp.json('_id')!.toString();
}
