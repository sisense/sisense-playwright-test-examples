import { UserContext } from '@config/UserContext';
import test, { APIResponse, expect } from '@playwright/test';
import { Datasource } from '@models/Datasource';
import { DatasourceV09 } from '@controllers/v0_9/datasources';

export class DatasourcesAPISteps {

    /**
     * Gets datasources that user can see
     * @param userContext   - user that makes the API call
     * @return array of all datasources user has access to
     */
    static async getAllDatasources(userContext: UserContext): Promise<Datasource[]> {
        return test.step(`Get all datasources by '${userContext.email}' via API`, async () => {
            const response: APIResponse = await DatasourceV09.getDatasources(userContext);
            expect(response.status()).toBe(200);
            return response.json();
        });
    }

    /**
     * Gets datasource by title (returns undefined if datasource wasn't found)
     * @param title         - datasource title
     * @param userContext   - user that makes the API call
     */
    static async getDatasourceByTitle(
        title: string,
        userContext: UserContext,
    ): Promise<Datasource> {
        return test.step(`Get '${title}' datasource by '${userContext.email}' via API`, async () => {
            const allDataSources: Datasource[] = await this.getAllDatasources(userContext);
            const targetDatasource: Datasource | undefined = allDataSources.find(
                (datasource: Datasource) => datasource.title === title,
            );
            if (targetDatasource) {
                return targetDatasource;
            } else
                throw new Error(
                    `Datasource with '${title}' title wasn't found by '${userContext.email}' via API`,
                );
        });
    }
}