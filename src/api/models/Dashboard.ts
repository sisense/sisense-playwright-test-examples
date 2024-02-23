import { Widget } from '@models/Widget';
import { Datasource } from '@models/Datasource';
import { DashboardSharesSubscription } from './DashboardSharesSubscription';
import { DashboardPermission } from '@models/DashboardPermission';

export interface Dashboard {
    oid?: string;
    title: string;
    filters?: [];
    type?: string;
    instanceType?: string;
    desc?: string;
    editing?: boolean;
    style?: {};
    datasource: Datasource;
    widgets: Widget[];
    shares?: DashboardPermission[];
    subscription?: DashboardSharesSubscription;
    previewLayout?: PreviewLayout[];
    allowChangeSubscription?: boolean;
}

export interface PreviewLayout {
    elasticubeBuilt?: boolean;
    elasticubeName?: boolean;
    filters?: boolean;
    format?: 'A0' | 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'LEGAL' | 'LETTER' | 'TABLOID';
    headerSize?: 'compact' | 'medium' | 'large' | 'none';
    layout?: 'asis' | 'feed';
    logo?: boolean;
    openPath?: string;
    orientation?: 'portrait' | 'landscape';
    pageNumbers?: boolean;
    pages?: [];
    savedByButton?: string;
    title?: boolean;
    type?: string;
}
