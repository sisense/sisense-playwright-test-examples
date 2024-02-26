export interface RelationsCustomizeTables {
    [key: string]: {
        field?: string;
        hide?: boolean;
        ignoreDraggableList?: boolean;
        index?: number;
    };
}

export interface UiSettings {
    admin?: {
        tenantsUiSettings?: {
            tenantsRowsOnPage?: number;
        };
    };
    ecmNext?: {
        dataPage?: {
            hideEcmHint?: boolean;
            hideListViewGuider?: boolean;
        };
        guidersShown?: {
            ecActions?: boolean;
            addData?: boolean;
            analytics?: boolean;
            dashboards?: boolean;
        };
        schemaPage?: {
            useTableView?: boolean;
            relationsCustomizeTables?: RelationsCustomizeTables;
        };
    };
}
