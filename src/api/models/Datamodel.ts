import { DatamodelPermission } from '@models/DatamodelPermission';
import { BuildDestination } from '@constants/buildDestination';

export interface Datamodel {
    oid: string;
    title: string;
    status: [];
    lastBuildStatus: string;
    type: string;
    creator: {
        id: string;
    };
    server: string;
    shares: DatamodelPermission[];
    tenant: Tenant;
    buildDestination?: {
        destination?: BuildDestination;
    };
    datasets?: [
        {
            oid: string;
            schema: {
                tables: [
                    {
                        name: string;
                        columns: [
                            {
                                name: string;
                                type: number;
                            },
                        ];
                    },
                ];
            };
        },
    ];
}
