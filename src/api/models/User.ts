import { RoleDisplayName } from '@constants/roleDisplayName';
import { LanguageCodeName } from '@constants/languageCodeName';

export interface User {
    _id?: string;
    email: string;
    firstName?: string;
    lastName?: string;
    groups?: string[];
    roleId?: string;
    roleName?: RoleDisplayName;
    password?: string;
    tenantId?: string;
    tenant?: {
        name: string;
        _id?: string;
    };
    manifest?: {
        tenants: {
            crossTenant: {
                allowed: boolean;
            };
        };
    };
    preferences?: {
        language: LanguageCodeName | '';
    };
    ldapDomainId?: string;
    userName?: string;
    uiSettings?: {};
}
