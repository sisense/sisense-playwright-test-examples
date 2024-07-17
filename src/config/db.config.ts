import { DbType } from '@constants/dbType';

// It's an example of db config. If you plan to create connections please follow this structure.

type DbProperties = {
    user?: string;
    password?: string;
    host?: string;
    defaultPort?: string;
    passwordConnector?: string;
    securityToken?: string;
    database?: string;
    jdbcJarsFolder?: string;
    driversClassName?: string;
    jarFileName?: string;
    serviceName?: string;
    region?: string;
    s3OutputLocation?: string;
    accessKey?: string;
    secretKey?: string;
    account?: string;
    getConnectionUrl?(): string;
    getServiceId?(): string;
    getConnectionString?(): string;
    getUrlConnectionString?(): string;
};

export function getDbConfig(dbType: DbType) {
    type ObjectKey = keyof typeof dbProperties;
    const dbKey = dbType as ObjectKey;
    return dbProperties[dbKey];
}

export function getStringValue(value: any) {
    if (value && typeof value === 'string') {
        return value;
    } else {
        console.log(`The value is not a string: '${value}'`);
        throw new Error(`The database doesn't contain required property`);
    }
}

export const dbProperties: {
    athena: DbProperties;
    azure: DbProperties;
    memsql: DbProperties;
    mongo: DbProperties;
    mysql: DbProperties;
    oracle: DbProperties;
    postgresql: DbProperties;
    redshift: DbProperties;
    salesforce: DbProperties;
    snowflake: DbProperties;
    sqlserver: DbProperties;
} = {
    athena: {
        jdbcJarsFolder: 'test',
        jarFileName: 'test',
        driversClassName: 'test',
        region: 'test',
        s3OutputLocation: 'test',
        accessKey: 'test',
        secretKey: 'test',
    },
    azure: {
        host: 'test',
        defaultPort: 'test',
        user: 'test',
        password: 'test',
        database: 'test',
        getConnectionUrl(): string {
            return `jdbc:sqlserver://${this.host}:${this.defaultPort};databaseName=${this.database};user=${this.user};password=${this.password}`;
        },
    },
    memsql: {
        host: 'test',
        defaultPort: 'test',
        user: 'test',
        password: 'test',
        database: 'test',
        getConnectionUrl(): string {
            return `jdbc:mysql://${this.host}:${this.defaultPort}/${this.database}?user=${this.user}&password=${this.password}`;
        },
    },
    mongo: {
        host: 'test',
        defaultPort: 'test',
        user: 'test',
        password: 'test',
        database: 'test',
    },
    mysql: {
        host: 'test',
        defaultPort: 'test',
        user: 'test',
        password: 'test',
        database: 'test',
        driversClassName: 'test',
        jdbcJarsFolder: 'test',
        getConnectionString(): string {
            return `jdbc:mysql://${this.host}:${this.defaultPort}`;
        },
        getConnectionUrl(): string {
            return `jdbc:mysql://${this.host}:${this.defaultPort}/${this.database}?user=${this.user}&password=${this.password}`;
        },
    },
    oracle: {
        host: 'test',
        defaultPort: 'test',
        user: 'test',
        password: 'test',
        driversClassName: 'test',
        jdbcJarsFolder: 'test',
        serviceName: 'test',
        getServiceId(): string {
            return `${this.serviceName}`;
        },
        getConnectionUrl(): string {
            return `jdbc:oracle:thin:@${this.host}:${this.defaultPort}:orcl`;
        },
        getConnectionString(): string {
            return `jdbc:oracle:thin:${this.user}/${this.password}@${this.host}:${this.defaultPort}:orcl`;
        },
        getUrlConnectionString(): string {
            return `jdbc:oracle:thin:@${this.host}:${this.defaultPort}:${this.serviceName}`;
        },
    },
    postgresql: {
        host: 'test',
        defaultPort: 'test',
        user: 'test',
        password: 'test',
        database: 'test',
        driversClassName: 'test',
        jdbcJarsFolder: 'test',
        getConnectionUrl(): string {
            return `jdbc:postgresql://${this.host}:${this.defaultPort}/${this.database}?user=${this.user}&password=${this.password}`;
        },
        getConnectionString(): string {
            return `jdbc:postgresql://${this.host}:${this.defaultPort}/${this.database}`;
        },
    },
    redshift: {
        host: 'test',
        defaultPort: 'test',
        user: 'test',
        password: 'test',
        database: 'test',
        driversClassName: 'test',
        jdbcJarsFolder: 'test',
        getConnectionUrl(): string {
            return `jdbc:redshift://${this.host}:${this.defaultPort}/${this.database}?user=${this.user}&password=${this.password}`;
        },
        getConnectionString(): string {
            return `jdbc:redshift:User=${this.user};Password=${this.password};Database=${this.database};Server=${this.host}`;
        },
    },
    salesforce: {
        user: 'test',
        password: 'test',
        securityToken: 'test',
        driversClassName: 'test',
        jdbcJarsFolder: 'test',
        getConnectionString(): string {
            return `jdbc:salesforce:User=${this.user};Password=${this.password};Security Token=${this.securityToken}`;
        },
    },
    snowflake: {
        host: 'test',
        account: 'test',
        defaultPort: 'test',
        user: 'test',
        password: 'test',
        passwordConnector: 'test',
        database: 'test',
        driversClassName: 'test',
        jdbcJarsFolder: 'test',
        getConnectionUrl(): string {
            return `jdbc:snowflake://${this.host}:${this.defaultPort}/?warehouse=DEMO_WH&user=${this.user}&password=${this.password}`;
        },
        getConnectionString(): string {
            return `jdbc:snowflake://${this.host}/?warehouse=DEMO_WH`;
        },
    },
    sqlserver: {
        host: 'test',
        defaultPort: 'test',
        user: 'test',
        password: 'test',
        database: 'test',
        driversClassName: 'test',
        jarFileName: 'test',
        jdbcJarsFolder: 'test',
        getConnectionUrl(): string {
            return `jdbc:sqlserver://${this.host}:${this.defaultPort};databaseName=${this.database};user=${this.user};password=${this.password}`;
        },
        getConnectionString(): string {
            return `jdbc:sql:user=${this.user};password=${this.password};Server=${this.host};Database=${this.database}`;
        },
    },
};
