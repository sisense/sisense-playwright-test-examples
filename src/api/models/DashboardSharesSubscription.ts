import { DashboardReportPreferencesConfig } from '@models/SendMeAReportConfig';

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
