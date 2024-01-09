export interface DashboardSearchQuickFilter {
    queryOptions: {
        sort: {
            title?: number;
            lastOpened?: number;
        };
        limit: number;
        skip: number;
    };
    queryParams: {
        ownershipType: string;
        search: string;
        ownerInfo: boolean;
        asObject: boolean;
    };
}
