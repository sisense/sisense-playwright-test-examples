import { Datasource } from '@models/Datasource';

export interface Widget {
    datasource: Datasource;
    oid: string;
    title: string;
    type: string;
    options?: {};
    metadata: { panels: [{ name: string; items: [] }] };
}
