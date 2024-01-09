export interface SendMeAReportConfig {
    assetId?: string;
    assetType?: string;
    recipients?: [
        {
            type: string;
            recipient: string;
        },
    ];
    preferences?: DashboardReportPreferencesConfig;
}

export interface DashboardReportPreferencesConfig {
    inline?: boolean;
    pdf?: {
        elasticubeBuiltValue?: string;
        includeTitle?: boolean;
        includeFilters?: boolean;
        includeDS?: boolean;
        preview?: boolean;
        renderingInfo?: {
            paperFormat?: 'A0' | 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'LEGAL' | 'LETTER' | 'TABLOID';
            paperOrientation?: 'portrait' | 'landscape';
            layout?: 'asis' | 'feed';
        };
    };
}

export const defaultDashboardReportPreferencesConfig: DashboardReportPreferencesConfig = {
    inline: true,
    pdf: {
        elasticubeBuiltValue: '', // to remove datasource last build time -> that makes tests more stable
        preview: true, // to use new PDF layout
        includeTitle: true,
        includeFilters: true,
        includeDS: true,
        renderingInfo: {
            paperFormat: 'A4',
            paperOrientation: 'portrait',
            layout: 'asis',
        },
    },
};
