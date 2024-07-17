import { UserContext } from '@config/UserContext';
import test, { APIResponse, expect } from '@playwright/test';
import { Datamodel } from '@models/Datamodel';
import { DatamodelsV2 } from '@controllers/v2_0/datamodels';

export class DatamodelAPISteps {

    /**
    * Deletes a datamodel by its name
    * @param datamodelName     - name of the datamodel that should be deleted
    * @param userContext       - user that makes the API call
    * @param skipIfNotFound    - skip the fact data model wasn't found by a user
    * and do not stop test execution (default is true = skip)
    */
    public static async deleteDatamodelByTitle(
        datamodelName: string,
        userContext: UserContext,
        skipIfNotFound: boolean = true,
    ): Promise<void> {
        await test.step(`Delete '${datamodelName}' data model by '${userContext.email}' via API`, async () => {
            const datamodel: Datamodel | undefined = await DatamodelAPISteps.getDatamodelByTitle(
                datamodelName,
                userContext,
            );
            if (datamodel) {
                await this.deleteDatamodelById(datamodel.oid, userContext);
                console.log(`Datamodel '${datamodelName}'(oid: ${datamodel.oid}) deleted`);
            } else if (!skipIfNotFound) {
                throw new Error(
                    `'${datamodelName}' data model wasn't found by '${userContext.email}' to delete`,
                );
            } else
                console.log(
                    `'${datamodelName}' datamodel wasn't deleted because it wasn't found by '${userContext.email}'`,
                );
        });
    }

    /**
   * Gets a datamodel by its name
   * @param datamodelName - name of the datamodel
   * @param userContext - user that makes the API call
   * @public
   * @returns [datamodel]{@link Datamodel} object (or undefined if not found)
   */
    public static async getDatamodelByTitle(
        datamodelName: string,
        userContext: UserContext,
    ): Promise<Datamodel | undefined> {
        return test.step(`Get '${datamodelName}' data model by '${userContext.email}' via API`, async () => {
            let datamodel: Datamodel;
            const response: APIResponse = await DatamodelsV2.getDatamodelsSchema(userContext, {
                title: datamodelName,
            });

            switch (response.status()) {
                case 200:
                    datamodel = await response.json();
                    console.log(`Datamodel '${datamodel.title}'(oid: ${datamodel.oid}) found`);
                    return datamodel;
                case 404:
                    console.log(`Datamodel '${datamodelName}' not found`);
                    return;
                default:
                    throw new Error(
                        `Something went wrong during getting '${datamodelName}' datamodel`,
                    );
            }
        });
    }

    /**
    * Deletes a datamodel by its id
    * @param datamodelId - id of the datamodel that should be deleted
    * @param userContext - user that makes the API call
    */
    public static async deleteDatamodelById(
        datamodelId: string,
        userContext: UserContext,
    ): Promise<void> {
        await test.step(`Delete data model with '${datamodelId}' ID by '${userContext.email}' via API`, async () => {
            const response = await DatamodelsV2.deleteDatamodels(datamodelId, userContext);
            expect(response.status()).toBe(200);
            console.log(`Datamodel with '${datamodelId}' id deleted`);
        });
    }
}