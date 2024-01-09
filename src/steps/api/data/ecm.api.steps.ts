import test, { expect } from '@playwright/test';
import { UserContext } from '@config/UserContext';
import { DatamodelAPISteps } from '@steps/api/data/datamodel.api.steps';
import { EcmV2 } from '@controllers/v2_0/ecm';

export class EcmAPISteps {

    /**
        * Publishes a datamodel by its name
        * @param datamodelName - name of the datamodel that should be published
        * @param userContext - user that makes the API call
        */
    public static async publishDatamodelByTitle(
        datamodelName: string,
        userContext: UserContext,
    ): Promise<void> {
        await test.step(`Publish '${datamodelName}' data model by '${userContext.email}' via API`, async () => {
            const datamodel = await DatamodelAPISteps.getDatamodelByTitle(
                datamodelName,
                userContext,
            );
            if (datamodel) {
                await this.publishDatamodelById(datamodel.oid, userContext);
                console.log(`Datamodel '${datamodelName}'(oid: ${datamodel.oid}) published`);
            } else {
                throw new Error(`Datamodel '${datamodelName}' doesn't exist to publish`);
            }
        });
    }

    /**
   * Publishes a datamodel by its id
   * @param datamodelId - datamodel id which should be deleted
   * @param userContext - user that makes the API call
   */
    public static async publishDatamodelById(
        datamodelId: string,
        userContext: UserContext,
    ): Promise<void> {
        await test.step(`Publish data model with '${datamodelId}' ID by '${userContext.email}' via API`, async () => {
            const body = this.getPublishLiveModelObject(datamodelId);
            const response = await EcmV2.postEcm(userContext, body);
            expect(response.status()).toBe(200);
            console.log(`Datamodel with '${datamodelId}' id published`);
        });
    }

    /**
   * Gets oid of a live model
   * @param oid - oid of a live model
   * @returns body for publish action
   */
    private static getPublishLiveModelObject(oid: string): object {
        return {
            query: 'mutation publishElasticube($elasticubeOid: UUID!) {\n  publishElasticube(elasticubeOid: $elasticubeOid)\n}\n',
            variables: {
                elasticubeOid: oid,
            },
            operationName: 'publishElasticube',
        };
    }
}