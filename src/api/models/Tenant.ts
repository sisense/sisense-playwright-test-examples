interface Tenant {
    // Tenant info data
    _id?: string;
    name: string;
    default?: boolean;
    systemManagement?: boolean;
    tenantDomainNames?: string[];

    // Tenant creation data
    disabled?: boolean;
    email?: string;
    isExistingUser?: boolean;
    license?: {
        admins: number;
        consumers: number;
        contributors: number;
    };
    password?: string;
    shouldCreateSamples?: boolean;
}

interface OnboardingTenant {
    userName?: string;
    userPassword?: string;
    domain: string;
}
