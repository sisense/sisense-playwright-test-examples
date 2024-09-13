import { sleep } from 'k6';
import { LanguageCodeName } from '../../src/constants/languageCodeName';
import http from 'k6/http';
import { checkResponse } from './verification.steps';
import { getParamsWithToken } from './login.steps';
import { envConfig } from '../../src/config/env.config';
import { UserContext } from '../config/UserContext';

/**
 * Creates users
 * @param userContext        - user that makes the API call
 * @param userNamePrefix     - prefix name for users
 * @param userRoleID         - role ID
 * @param usersTotalNumber   - (optional) total amount of users required to be created, default = 1
 * @param usersChunkNumber   - (optional) amount of users to create within one api call, default = usersTotalNumber
 * @param timeout            - (optional) sleep timeout after api call, default = 0
 */
export function createUsers(
    userContext: UserContext,
    userNamePrefix: string,
    userRoleID: string,
    usersTotalNumber: number = 1,
    usersChunkNumber: number = usersTotalNumber,
    timeout: number = 0,
) {
    let usersResponse: any[] = [];
    const chunksNumber = Math.ceil(usersTotalNumber / usersChunkNumber);
    const remainder = usersTotalNumber % usersChunkNumber;
    for (let chunk = 1; chunk <= chunksNumber; chunk++) {
        let users: any[] = [];
        let usersInChunk = chunk === chunksNumber && remainder !== 0 ? remainder : usersChunkNumber;
        console.log(`Creating ${usersInChunk} users, iteration ${chunk} of ${chunksNumber}`);
        for (let user = 1; user <= usersInChunk; user++) {
            const userNumber = (chunk - 1) * usersChunkNumber + user;
            const userName = `${userNamePrefix}_${userNumber}`;
            const email = `${userName}@sisense.com`;
            const userBody = createUserBody(email, userRoleID);
            users.push(userBody);
        }
        const body = JSON.stringify(users);
        const response = postUsers(userContext, body);
        const responseJson = response.json();
        usersResponse = usersResponse.concat(responseJson);
        sleep(timeout);
    }
    return usersResponse;
}

/**
 * Creates users
 * @param userContext - user that makes the API call
 * @param body        - users body
 */
function postUsers(userContext: UserContext, body: string) {
    const params = getParamsWithToken(userContext);
    const postUsers = http.post(userContext.baseUrl + `api/users`, body, params);
    checkResponse(postUsers, 200, 'Create users ');
    return postUsers;
}

/**
 * Generates request body for create user api call
 * @param userEmail  - user email
 * @param userRoleID - role ID
 * returns request body for create user api call
 */
function createUserBody(userEmail: string, userRoleID: string) {
    return {
        email: userEmail,
        firstName: '',
        lastName: '',
        groups: [],
        roleId: userRoleID,
        password: envConfig.defaultPassword,
        preferences: {
            language: LanguageCodeName.SYSTEM_LANGUAGE,
        },
        manifest: {
            tenants: {
                crossTenant: {
                    allowed: false,
                },
            },
        },
    };
}

export function deleteUsersById(userContext: UserContext, userIds: string[]) {
    const params = getParamsWithToken(userContext);
    const deleteUsersResp = http.del(
        userContext.baseUrl + 'api/v1/users/bulk?ids=' + userIds,
        null,
        params,
    );
    checkResponse(deleteUsersResp, 204, 'Delete users');
    console.log(`Deleted users: ${userIds}`);
}

/**
 * Deletes users
 * @param userContext     - user that makes the API call
 * @param searchTerm      - (optional) search query to filter by
 * @param deleteChunkSize - (optional) amount of users to delete within one api call, default = 100
 */
export function deleteUsers(
    userContext: UserContext,
    searchTerm?: string,
    deleteChunkSize: number = 100,
): void {
    const usersAmountToDelete: number = getUsersCount(userContext, searchTerm);
    const iterations: number = Math.ceil(usersAmountToDelete / deleteChunkSize);
    console.log(`Delete ${usersAmountToDelete} users in ${iterations} iterations`);
    for (let i = 0; i <= iterations; i++) {
        console.log(`Deleting ${deleteChunkSize} users, iteration ${i} of ${iterations}`);
        const userIDs = getUserIDsList(userContext, searchTerm, deleteChunkSize);
        deleteUsersById(userContext, userIDs);
    }
}

/**
 * Gets users emails array
 * @param userContext   - user that makes the API call
 * @param searchTerm    - (optional) search query to filter by
 * @param usersToReturn - (optional) how many total results should be returned, default: 500
 * returns users emails array for specified users search request
 */
export function getUserEmailsList(
    userContext: UserContext,
    searchTerm?: string,
    usersToReturn: number = 500,
): string[] {
    let testEmails: string[] = [];
    const limit: number = 500;
    let skip: number = 0;
    const iterations: number = Math.ceil(usersToReturn / limit);
    console.log(`Return emails for ${usersToReturn} users in ${iterations} iterations`);
    for (let i = 1; i <= iterations; i++) {
        const userEmails = getUsers(userContext, searchTerm, limit, skip).json('#.email');
        if (Array.isArray(userEmails)) {
            const emails: string[] = userEmails.map((item) => item as string);
            console.log(
                `Received ${emails.length} emails to run the test. Iteration ${i} of ${iterations}`,
            );
            testEmails.push(...emails);
        } else {
            throw new Error(
                'The extracted JSONValue is not an array. No user emails found to run the test',
            );
        }
        skip = skip + limit;
    }
    return testEmails;
}

/**
 * Gets users IDs array
 * @param userContext - user that makes the API call
 * @param searchTerm  - (optional) search query to filter by
 * @param limit       - (optional) how many results should be returned
 * @param skip        - (optional) number of results to skip from the start of the data set
 * returns users IDs array for specified users search request
 */
export function getUserIDsList(
    userContext: UserContext,
    searchTerm?: string,
    limit?: number,
    skip?: number,
): string[] {
    const userEmails = getUsers(userContext, searchTerm, limit, skip).json('#._id');
    if (Array.isArray(userEmails)) {
        return userEmails.map((item) => item as string);
    } else {
        return [];
    }
}

/**
 * Gets users array
 * @param userContext - user that makes the API call
 * @param searchTerm  - (optional) search query to filter by
 * @param limitNumber - (optional) how many results should be returned
 * @param skipNumber  - (optional) number of results to skip from the start of the data set
 * returns users array for specified users search request
 */
export function getUsers(
    userContext: UserContext,
    searchTerm?: string,
    limitNumber: number = 50,
    skipNumber: number = 0,
) {
    const limit: string = limitNumber.toString();
    const skip: string = skipNumber.toString();
    const params = getParamsWithToken(userContext);
    const getUsersResp = http.get(
        userContext.baseUrl +
        `api/users?${searchTerm ? `&search=${searchTerm}` : ''}${limit ? `&limit=${limit}` : ''
        }${skip ? `&skip=${skip}` : ''}`,
        params,
    );
    checkResponse(getUsersResp, 200, 'Get users');
    return getUsersResp;
}

/**
 * Gets number of users
 * @param userContext - user that makes the API call
 * @param searchTerm  - (optional) search query to filter by
 * returns number of users
 */
function getUsersCount(userContext: UserContext, searchTerm?: string) {
    const params = getParamsWithToken(userContext);
    const getUsersCount = http.get(
        userContext.baseUrl + `api/users/count${searchTerm ? `?search=${searchTerm}` : ''}`,
        params,
    );
    checkResponse(getUsersCount, 200, 'Get users count');
    return Number(getUsersCount.json('count'));
}
