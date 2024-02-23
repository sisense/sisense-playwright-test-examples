import { DashboardReportPreferencesConfig } from '@models/SendMeAReportConfig';
import { getCurrentDate } from '@utils/timeUtils';

export interface DashboardSharesSubscription {
    context?: {
        dashboardid: string;
    };
    emailSettings?: {
        isEmail?: boolean;
        isPdf?: boolean;
    };
    executionPerDay?: number;
    isDataChange?: boolean;
    reportType?: DashboardReportPreferencesConfig;
    schedule?: string;
    startAt?: string;
    subscribe?: boolean;
    timezone?: number;
    type?: 'daily' | 'monthly' | 'onUpdate';
    tzName?: string;
    custom?: boolean;
    active?: boolean;
}

export const defaultDashboardSharesSubscription: DashboardSharesSubscription = {
    executionPerDay: 1,
    schedule: '* * * * * *',
    isDataChange: true,
    type: 'onUpdate',
    reportType: {
        inline: false,
    },
    emailSettings: {
        isEmail: true,
        isPdf: false,
    },
    context: {
        dashboardid: '',
    },
    startAt: getCurrentDate(),
    tzName: 'Europe/Kyiv',
    timezone: -120,
    active: false,
};

export const defaultDashboardSharesSubscriptionPDF: DashboardSharesSubscription = {
    subscribe: true,
    executionPerDay: 1,
    schedule: '* * * * * *',
    isDataChange: true,
    type: 'onUpdate',
    reportType: {
        inline: false,
        pdf: {
            preview: true,
            includeTitle: true,
            includeFilters: true,
            includeDS: true,
            elasticubeBuiltValue: '',
            renderingInfo: {
                paperFormat: 'A4',
                paperOrientation: 'portrait',
                layout: 'asis',
            },
        },
    },
    emailSettings: {
        isEmail: false,
        isPdf: true,
    },
    context: {
        dashboardid: '',
    },
    startAt: getCurrentDate(),
    tzName: 'Europe/Kyiv',
    timezone: -120,
    active: true,
};
