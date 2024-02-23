import { LanguageCodeName } from '@constants/languageCodeName';
import { RoleName } from '@constants/roleName';

export interface Group {
    _id?: string;
    roleId?: string;
    name: string;
    ad?: boolean;
    objectSid?: string;
    dn?: string;
    uSNChanged?: string;
    mail?: string;
    defaultRole?: RoleName;
    ldapDomainId?: string;
    language?: LanguageCodeName;
    timeout?: string;
    themeId?: string;
    excludeFromSharing?: boolean;
    usersCount?: boolean;
    tenantId?: string;
    tenant?: {
        name: string;
        _id?: string;
    };
}
