import test, { APIResponse, expect } from '@playwright/test';
import { UserContext } from '@config/UserContext';
import { Dashboard } from '@models/Dashboard';
import { envConfig } from '@config/env.config';
import { DashboardSearchFilterType } from '@constants/dashboardSearchFilterType';
import { DashboardSearchQuickFilter } from '@models/DashboardSearchQuickFilter';
import { RoleDisplayName as ROLE_NAME } from '@constants/roleDisplayName';
import { OwnershipType } from '@constants/ownershipType';
import { DashboardsV1 } from '@controllers/v1_0/dashboards';
import { DashboardsV09 } from '@controllers/v0_9/dashboards';
import { downloadFileFromArtifactory } from '@utils/artifactoryUtils';
import { getJsonFromArtifactsFile } from '@utils/jsonUtils';
import { DashboardImportAction } from '@constants/dashboardImportAction';


export class DashboardsAPISteps {

    /**
    * Gets dashboard by its title (returns undefined if dashboard wasn't found by user)
    * @param dashboardTitle - title of dashboard to find
    * @param userContext    - user that makes the API call
    * @returns Dashboard if was found else returns undefined
    */
    static async getDashboardByTitle(
        dashboardTitle: string,
        userContext: UserContext,
    ): Promise<Dashboard | undefined> {
        let allDashboards: Dashboard[];

        if (envConfig.isWindows) {
            allDashboards = await DashboardsAPISteps.searchDashboards(
                userContext,
                '',
                DashboardSearchFilterType.ALL,
            );
        } else {
            allDashboards = await DashboardsAPISteps.getDashboards(userContext);
        }

        const dashboard: Dashboard | undefined = allDashboards.find(
            (dash) => dash.title === dashboardTitle,
        );
        console.log(`Dashboard ${dashboard ? '' : 'NOT '}found: '${dashboardTitle}'`);
        return dashboard;
    }

    /**
    * Searches for dashboards using searchTerm and quickFilterType
    * @param searchTerm                            - search term to find dashboard by part name
    * @param dashboardQuickFilterOwnershipType     - type of dashboard search quick filter (RECENT, ALL, etc.)
    * @param userContext                           - user that makes the API call
    */
    static async searchDashboards(
        userContext: UserContext,
        searchTerm: string,
        dashboardQuickFilterOwnershipType: DashboardSearchFilterType,
    ): Promise<Dashboard[]> {
        return test.step(`Search for dashboards by ${searchTerm ? `${searchTerm} search term and` : ''
            } '${dashboardQuickFilterOwnershipType}' quick filter type by '${userContext.email
            }' via API`, async () => {
                const quickFilterObject: DashboardSearchQuickFilter =
                    this.getDashboardSearchQuickFilterObject(
                        searchTerm,
                        dashboardQuickFilterOwnershipType,
                        userContext.roleName,
                    );
                const response: APIResponse = await DashboardsV1.postDashboardsSearches(
                    quickFilterObject,
                    userContext,
                );
                expect(response.status()).toBe(200);
                return (await response.json()).items as Dashboard[];
            });
    }

    /**
     * Gets all dashboards
     * @param userContext    - user that makes the API call
     * @param dashboardTitle - dashboard title
     * @return array of dashboards
     */
    static async getDashboards(
        userContext: UserContext,
        dashboardTitle?: string,
    ): Promise<Dashboard[]> {
        const response: APIResponse = await DashboardsV1.getDashboards(userContext, dashboardTitle);
        expect(response.status()).toBe(200);
        return response.json();
    }

    /**
     * Creates dashboard quick filter object to search for dashboard via API
     * @param searchTerm                        - search term to find dashboard by part name
     * @param dashboardQuickFilterOwnershipType - type of dashboard search quick filter (RECENT, ALL, etc.)
     * @param userRole                          - the role of the user performing search
     * @param limit                             - amount of limit of dashboards to return
     * @param skip                              - amount of dashboard to skip from the start
     * @param asObject
     * @param ownerInfo
     * @private
     */
    private static getDashboardSearchQuickFilterObject(
        searchTerm: string,
        dashboardQuickFilterOwnershipType: DashboardSearchFilterType,
        userRole: string,
        limit: number = 50,
        skip: number = 0,
        asObject: boolean = true,
        ownerInfo: boolean = true,
    ): DashboardSearchQuickFilter {
        const ownershipType: string = this.getOwnershipTypeForUserRole(
            dashboardQuickFilterOwnershipType,
            userRole,
        );

        switch (dashboardQuickFilterOwnershipType) {
            case DashboardSearchFilterType.RECENT:
                return {
                    queryOptions: {
                        limit,
                        skip,
                        sort: { lastOpened: -1 },
                    },
                    queryParams: {
                        asObject,
                        ownerInfo,
                        ownershipType: ownershipType,
                        search: searchTerm,
                    },
                };
            case DashboardSearchFilterType.ALL:
                return {
                    queryOptions: {
                        limit,
                        skip,
                        sort: { title: 1 },
                    },
                    queryParams: {
                        asObject,
                        ownerInfo,
                        ownershipType: ownershipType,
                        search: searchTerm,
                    },
                };
            case DashboardSearchFilterType.CREATED_BY_MY:
                return {
                    queryOptions: {
                        limit,
                        skip,
                        sort: { title: 1 },
                    },
                    queryParams: {
                        asObject,
                        ownerInfo,
                        ownershipType: ownershipType,
                        search: searchTerm,
                    },
                };
            case DashboardSearchFilterType.SHARED_WITH_ME:
                return {
                    queryOptions: {
                        limit,
                        skip,
                        sort: { title: 1 },
                    },
                    queryParams: {
                        asObject,
                        ownerInfo,
                        ownershipType: ownershipType,
                        search: searchTerm,
                    },
                };
            default:
                throw new Error(
                    `Can't get dashboard quick filter object using '${searchTerm}' search term and '${dashboardQuickFilterOwnershipType}' quick filter type`,
                );
        }
    }

    private static getOwnershipTypeForUserRole(quickFilter: string, userRole: string) {
        if (
            userRole === ROLE_NAME.SYS_ADMIN ||
            userRole === ROLE_NAME.ADMIN ||
            userRole === ROLE_NAME.TENANT_ADMIN
        ) {
            switch (quickFilter) {
                case DashboardSearchFilterType.RECENT:
                    return OwnershipType.OWNER_AND_SHARED_BY_LAST_OPENED;
                case DashboardSearchFilterType.ALL:
                    return OwnershipType.ALL_ROOT;
                case DashboardSearchFilterType.CREATED_BY_MY:
                    return OwnershipType.OWNER;
                case DashboardSearchFilterType.SHARED_WITH_ME:
                    return OwnershipType.SHARED_ROOT;
                default:
                    throw new Error(
                        `Can't get Ownership Type for '${quickFilter}' dashboard quick filter by '${userRole}' user role`,
                    );
            }
        } else if (
            userRole === ROLE_NAME.DATA_ADMIN ||
            userRole === ROLE_NAME.DATA_DESIGNER ||
            userRole === ROLE_NAME.DESIGNER
        ) {
            switch (quickFilter) {
                case DashboardSearchFilterType.RECENT:
                    return OwnershipType.OWNER_AND_SHARED_BY_LAST_OPENED;
                case DashboardSearchFilterType.ALL:
                    return OwnershipType.OWNER_AND_SHARED;
                case DashboardSearchFilterType.CREATED_BY_MY:
                    return OwnershipType.OWNER;
                case DashboardSearchFilterType.SHARED_WITH_ME:
                    return OwnershipType.SHARED;
                default:
                    throw new Error(
                        `Can't get Ownership Type for '${quickFilter}' dashboard quick filter by '${userRole}' user role`,
                    );
            }
        } else if (userRole === ROLE_NAME.VIEWER) {
            switch (quickFilter) {
                case DashboardSearchFilterType.RECENT:
                    return OwnershipType.OWNER_AND_SHARED_BY_LAST_OPENED;
                case DashboardSearchFilterType.ALL:
                    return OwnershipType.OWNER_AND_SHARED;
                default:
                    throw new Error(
                        `Can't get Ownership Type for '${quickFilter}' dashboard quick filter by '${userRole}' user role`,
                    );
            }
        } else {
            throw new Error(
                `Quick filters ownership type is not defined for user role '${userRole}'.\n` +
                `Please update 'getOwnershipTypeForUserRole' method to support '${userRole}' user role`,
            );
        }
    }

    /**
    * Deletes dashboard by its title if was found
    * @param dashboardTitle    - title of the dashboard to delete
    * @param userContext       - user that makes the API call
    * @param skipIfNotFound    - skip the fact dashboard wasn't found by a user
    * and do not stop test execution (default is true = skip)
    */
    static async deleteDashboardByTitle(
        dashboardTitle: string,
        userContext: UserContext,
        skipIfNotFound: boolean = true,
    ): Promise<void> {
        await test.step(`Delete '${dashboardTitle}' dashboard by '${userContext.email}' via API`, async () => {
            const dashboard: Dashboard | undefined = await this.getDashboardByTitle(
                dashboardTitle,
                userContext,
            );
            if (dashboard) {
                const dashboardId: string | undefined = dashboard.oid;
                const response: APIResponse = await DashboardsV09.deleteDashboard(
                    dashboardId!,
                    userContext,
                );
                expect(response.status()).toBe(200);
                console.log(`Dashboard deleted: '${dashboardTitle}'(ID: '${dashboardId}')`);
            } else if (!skipIfNotFound) {
                throw new Error(
                    `'${dashboardTitle}' dashboard wasn't found by '${userContext.email}' to delete`,
                );
            } else
                console.log(
                    `'${dashboardTitle}' dashboard wasn't deleted because it wasn't found by '${userContext.email}'`,
                );
        });
    }

    /**
    * Import dashboard under the user
    * @param dashboardName         - dashboard name to import
    * @param userContext           - user that makes the API call
    * @param dashboardImportAction - SKIP or OVERWRITE the dashboard if already exists
    */
    static async importDashboard(
        dashboardName: string,
        userContext: UserContext,
        dashboardImportAction?: DashboardImportAction,
    ): Promise<void> {
        const title = dashboardImportAction
            ? `Import '${dashboardName}' dashboard with '${dashboardImportAction.toUpperCase()}' option by '${userContext.email
            }' via API`
            : `Import '${dashboardName}' dashboard by '${userContext.email}' via API`;
        await test.step(title, async () => {
            // Download dashboard from Artifactory
            await downloadFileFromArtifactory(dashboardName);

            const dashboard: Dashboard = getJsonFromArtifactsFile(dashboardName);

            const params = dashboardImportAction
                ? { ['action']: dashboardImportAction }
                : undefined;
            const response: APIResponse = await DashboardsV1.postDashboardsImportBulk(
                [dashboard],
                userContext,
                params,
            );
            expect(response.status()).toBe(201);
            console.log(`Dashboard imported: '${dashboardName}'`);
        });
    }
}