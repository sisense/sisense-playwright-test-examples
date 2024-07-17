import test, { APIResponse, expect } from '@playwright/test';
import { UserContext } from '@config/UserContext';
import { DashboardSearchFilterType } from '@constants/dashboardSearchFilterType';
import { DashboardSearchQuickFilter } from '@models/DashboardSearchQuickFilter';
import { RoleDisplayName as ROLE_NAME } from '@constants/roleDisplayName';
import { OwnershipType } from '@constants/ownershipType';
import { DashboardsV1 } from '@controllers/v1_0/dashboards';
import { DashboardsV09 } from '@controllers/v0_9/dashboards';
import { DatasourcesAPISteps } from '@steps/api/data/datasources.api.steps';
import { Datasource } from '@models/Datasource';
import {
    DashboardPermission,
    DashboardPermissionByUserGroupName,
    DashboardShareData,
    DashboardShares,
} from '@models/DashboardPermission';
import { PermissionType } from '@constants/permissionType';
import { UsersAPISteps } from '@steps/api/admin/users.api.steps';
import { GroupsAPISteps } from '@steps/api/admin/groups.api.steps';
import {
    DashboardSharesSubscription,
    defaultDashboardSharesSubscription,
    defaultDashboardSharesSubscriptionPDF,
} from '@models/DashboardSharesSubscription';
import { Dashboard, PreviewLayout } from '@models/Dashboard';
import { SharesV09 } from '@controllers/v0_9/shares';

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

        allDashboards = await DashboardsAPISteps.getDashboards(userContext);
        const dashboard: Dashboard | undefined = allDashboards.find(
            (dash) => dash.title === dashboardTitle,
        );
        console.log(`Dashboard ${dashboard ? '' : 'NOT '}found: '${dashboardTitle}'`);
        return dashboard;
    }

    /**
     * Verifies user can see only next dashboard using search term and quick filter type
     * @param searchTerm                            - search term to find dashboard by part name
     * @param dashboardQuickFilterOwnershipType     - type of dashboard search quick filter (RECENT, ALL, etc.)
     * @param expectedDashboardsTitles              - expected list of dashboard titles
     * @param userContext                           - user that makes the API call
     */
    static async verifyDashboardsSearchesReturnsOnlyDashboards(
        userContext: UserContext,
        searchTerm: string,
        dashboardQuickFilterOwnershipType: DashboardSearchFilterType,
        expectedDashboardsTitles: string[],
    ): Promise<void> {
        await test.step(`Verify dashboard search using: ${searchTerm ? `search term '${searchTerm}',` : ' '
            } filter type '${dashboardQuickFilterOwnershipType}' equals next dashboards: '${expectedDashboardsTitles.join(
                ', ',
            )}' by '${userContext.email}' via API`, async () => {
                const dashboards: Dashboard[] = await this.searchDashboards(
                    userContext,
                    searchTerm,
                    dashboardQuickFilterOwnershipType,
                );
                const titles: string[] = dashboards.map((dash) => dash.title);
                expect(titles).toEqual(expectedDashboardsTitles);
            });
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
     * Deletes dashboards by admin user by title if was found
     * @param dashboardTitles - titles of the dashboards to delete, exact match
     * @param userContext     - user that makes the API call, admin user role
     */
    static async deleteDashboardsBulkByAdmin(
        dashboardTitles: string[],
        userContext: UserContext,
    ): Promise<void> {
        await test.step(`Delete '${dashboardTitles.join(', ')}' dashboards by '${userContext.email
            }' via API`, async () => {
                const rawDashboardIds: string[] = [];
                for (const dashboardTitle of dashboardTitles) {
                    const dashboards: Dashboard[] = await DashboardsAPISteps.getDashboardByTitleByAdmin(
                        dashboardTitle,
                        userContext,
                    );
                    if (dashboards.length !== 0) {
                        for (const dashboard of dashboards) {
                            rawDashboardIds.push(dashboard.oid!);
                        }
                    } else
                        console.log(
                            `'${dashboardTitle}' dashboard wasn't deleted because it wasn't found by '${userContext.email}'`,
                        );
                }
                const dashboardIds: string[] = [...new Set(rawDashboardIds)];
                if (dashboardIds.length !== 0) {
                    const response: APIResponse = await DashboardsV1.deleteDashboardsBulk(
                        dashboardIds,
                        userContext,
                    );
                    expect(response.status()).toBe(200);
                    console.log((await response.body()).toString());
                } else console.log(`No dashboards found to delete by '${userContext.email}' user`);
            });
    }

    /**
     * Gets dashboards by titles
     * @param dashboardTitle - title of dashboard to find
     * @param userContext    - user that makes the API call, admin user role
     * @returns Dashboard[] array of dashboards
     */
    static async getDashboardByTitleByAdmin(
        dashboardTitle: string,
        userContext: UserContext,
    ): Promise<Dashboard[]> {
        return test.step(`Get dasboard by '${dashboardTitle}' title by admin '${userContext.email}' user via API`, async (): Promise<
            Dashboard[]
        > => {
            const response: Dashboard[] = await this.getDashboardsAdminByName(
                userContext,
                dashboardTitle,
            );
            const dashboards: Dashboard[] = response.filter(
                (dash) => dash.title === dashboardTitle,
            );
            console.log(
                `Dashboard ${dashboards.length !== 0 ? '' : 'NOT '}found: '${dashboardTitle}'`,
            );
            return dashboards;
        });
    }

    /**
     * Gets dashboards by name search
     * @param dashboardTitle - title of dashboard to find
     * @param userContext    - user that makes the API call, admin user role
     */
    static async getDashboardsAdminByName(
        userContext: UserContext,
        dashboardTitle: string,
    ): Promise<Dashboard[]> {
        return test.step(`Get dashboards admin by '${dashboardTitle}' name with '${userContext.email}' user via API`, async (): Promise<
            Dashboard[]
        > => {
            const response: APIResponse = await DashboardsV1.getDashboardsAdminByName(
                userContext,
                dashboardTitle,
            );
            expect(response.status()).toBe(200);
            return response.json();
        });
    }

    /**
     * Creates new dashboard in the system
     * @param datasourceTitle - title of new dashboard datasource
     * @param dashboardTitle  - title of new dashboard
     * @param userContext     - user that makes the API call
     */
    static async addDashboard(
        dashboardTitle: string,
        datasourceTitle: string,
        userContext: UserContext,
    ): Promise<void> {
        await test.step(`Create '${dashboardTitle}' dashboard by '${userContext.email}' via API`, async () => {
            const targetDatasource: Datasource = await DatasourcesAPISteps.getDatasourceByTitle(
                datasourceTitle,
                userContext,
            );
            const dashboard: Dashboard = {
                title: dashboardTitle,
                style: {},
                filters: [],
                editing: true,
                type: 'dashboard',
                datasource: targetDatasource,
                widgets: [],
            };
            const response: APIResponse = await DashboardsV09.postDashboards(
                dashboard,
                userContext,
            );
            expect(response.status()).toBe(200);
        });
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
     * Gets dashboard permission array object with user/groups ids
     * @param dashboardPermissionsByUserGroupName - dashboard permission object with group and usernames instead of partyId {@link DashboardPermissionByUserGroupName}
     * @param userContext - user that makes the API call
     * @returns dashboard permission array object
     */
    private static async getDashboardPermissionsBody(
        dashboardPermissionsByUserGroupName: DashboardPermissionByUserGroupName[],
        userContext: UserContext,
    ): Promise<DashboardPermission[]> {
        let dashboardPermissions: DashboardPermission[] = [];
        for (const dashboardPermission of dashboardPermissionsByUserGroupName) {
            let shareId: string = '';
            if (dashboardPermission.type === PermissionType.GROUP) {
                shareId = await GroupsAPISteps.getGroupIdByName(
                    dashboardPermission.userGroupName,
                    userContext,
                );
            } else if (dashboardPermission.type === PermissionType.USER) {
                shareId = await UsersAPISteps.getUserIdByName(
                    dashboardPermission.userGroupName,
                    userContext,
                );
            } else {
                throw new Error(`Neither group nor user is used for permission`);
            }
            dashboardPermissions.push({
                shareId,
                type: dashboardPermission.type,
                subscribe: dashboardPermission.subscribe,
                rule: dashboardPermission.rule,
            });
        }
        return dashboardPermissions;
    }

    /**
    * <h3>Shares dashboard with user/group</h3>
    *
    * If you want just enable PDF reporting with exist dashboard pdf settings, use:
    * subscription: {
    *                     reportType: {
    *                         pdf: {},
    *                     },
    *                 }
    *
    * This will generate JSON with default settings
    * <p>You can also override any parameter on your own</p>
    * @param dashboardTitle        - title of the dashboard
    * @param dashboardShareData    - dashboard permission object with group and usernames instead of partyId
    * @param userContext           - user that makes the API call
    * @param options               - optional parameters
    * @param options.extendShares  - if true - adds new shares to exist ones (by default overrides)
    */
    static async shareDashboard(
        dashboardTitle: string,
        dashboardShareData: DashboardShareData,
        userContext: UserContext,
        options?: {
            extendShares?: true | false;
        },
    ): Promise<void> {
        await test.step(`Share '${dashboardTitle}' dashboard by '${userContext.email}' via API`, async () => {
            const dashboard: Dashboard | undefined = await DashboardsAPISteps.getDashboardByTitle(
                dashboardTitle,
                userContext,
            );
            if (!dashboard) {
                throw new Error(`Dashboard '${dashboardTitle}' was not found`);
            } else {
                const { permissions, subscription, allowChangeSubscription, sharesToNew } =
                    dashboardShareData;

                // converts shares list with user/group names to shares list with user/group ids
                let dashboardPermissions: DashboardPermission[] =
                    await this.getDashboardPermissionsBody(permissions, userContext);

                // extends exist shares list with new shares if needed
                if (options?.extendShares) {
                    dashboardPermissions = dashboard.shares!.concat(dashboardPermissions);
                }

                let dashboardShares: DashboardShares = { sharesTo: dashboardPermissions };

                if (allowChangeSubscription !== undefined) {
                    dashboardShares = {
                        ...dashboardShares,
                        allowChangeSubscription: allowChangeSubscription,
                    };
                }

                if (sharesToNew) {
                    dashboardShares = {
                        ...dashboardShares,
                        sharesToNew: sharesToNew,
                    };
                }

                if (subscription) {
                    let subscriptionObject: DashboardSharesSubscription;
                    const lastPreviewLayoutObject: PreviewLayout | undefined =
                        dashboard.previewLayout?.[dashboard.previewLayout.length - 1];

                    if (subscription.reportType?.pdf || subscription.emailSettings?.isPdf) {
                        // mapping all parameters
                        subscriptionObject = {
                            ...subscription,
                            reportType: {
                                inline:
                                    subscription?.reportType?.inline ??
                                    dashboard.subscription?.emailSettings?.isEmail ??
                                    defaultDashboardSharesSubscriptionPDF.reportType?.inline,
                                pdf: {
                                    elasticubeBuiltValue: '', // to remove datasource last build time -> that makes tests more stable
                                    preview: true, // to use new PDF layout
                                    includeDS:
                                        subscription?.reportType?.pdf?.includeDS ??
                                        lastPreviewLayoutObject?.elasticubeName ??
                                        defaultDashboardSharesSubscriptionPDF.reportType?.pdf
                                            ?.includeDS,
                                    includeFilters:
                                        subscription?.reportType?.pdf?.includeFilters ??
                                        lastPreviewLayoutObject?.filters ??
                                        defaultDashboardSharesSubscriptionPDF.reportType?.pdf
                                            ?.includeFilters,
                                    includeTitle:
                                        subscription?.reportType?.pdf?.includeTitle ??
                                        lastPreviewLayoutObject?.title ??
                                        defaultDashboardSharesSubscriptionPDF.reportType?.pdf
                                            ?.includeTitle,
                                    renderingInfo: {
                                        layout:
                                            subscription?.reportType?.pdf?.renderingInfo?.layout ??
                                            lastPreviewLayoutObject?.layout ??
                                            defaultDashboardSharesSubscriptionPDF.reportType?.pdf
                                                ?.renderingInfo?.layout,
                                        paperFormat:
                                            subscription?.reportType?.pdf?.renderingInfo
                                                ?.paperFormat ??
                                            lastPreviewLayoutObject?.format ??
                                            defaultDashboardSharesSubscriptionPDF.reportType?.pdf
                                                ?.renderingInfo?.paperFormat,
                                        paperOrientation:
                                            subscription?.reportType?.pdf?.renderingInfo
                                                ?.paperOrientation ??
                                            lastPreviewLayoutObject?.orientation ??
                                            defaultDashboardSharesSubscriptionPDF.reportType?.pdf
                                                ?.renderingInfo?.paperOrientation,
                                    },
                                },
                            },
                            emailSettings: {
                                isEmail:
                                    subscription.emailSettings?.isEmail ??
                                    dashboard.subscription?.emailSettings?.isEmail ??
                                    defaultDashboardSharesSubscriptionPDF.reportType?.inline,
                                isPdf:
                                    subscription.emailSettings?.isPdf ??
                                    dashboard.subscription?.emailSettings?.isPdf ??
                                    !!defaultDashboardSharesSubscriptionPDF.reportType?.pdf,
                            },
                        };
                        dashboardShares = {
                            ...dashboardShares,
                            subscription: {
                                ...defaultDashboardSharesSubscriptionPDF,
                                ...dashboard.subscription,
                                ...subscriptionObject,
                                context: {
                                    dashboardid: dashboard!.oid as string,
                                },
                            },
                        };
                    } else {
                        subscriptionObject = subscription;
                        dashboardShares = {
                            ...dashboardShares,
                            subscription: {
                                ...defaultDashboardSharesSubscription,
                                ...dashboard.subscription,
                                ...subscriptionObject,
                                context: {
                                    dashboardid: dashboard!.oid as string,
                                },
                            },
                        };
                    }
                }

                // log to console JSON object that's going to be sent
                console.log(
                    `shares object that's going to be sent:\n${JSON.stringify(dashboardShares)}\n`,
                );

                const response: APIResponse = await SharesV09.postSharesDashboardById(
                    dashboard.oid!,
                    dashboardShares,
                    userContext,
                );
                expect(response.status()).toBe(200);
                console.log(`Dashboard '${dashboardTitle}' is shared`);
            }
        });
    }
}