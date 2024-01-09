import { APIResponse } from '@playwright/test';
import { UserContext } from '@config/UserContext';
import { CliV2 } from '@controllers/v2_0/cliV2';

export class CliAPISteps {
    public static async getAllExistingPodsAsTable(userContext: UserContext): Promise<string> {
        return (await this.getAllPodsInformation(userContext)).text();
    }

    /**
     * Gets all the pods information in a table view from CLI
     * @param userContext - user that makes the API call
     * @private
     */
    private static async getAllPodsInformation(userContext: UserContext): Promise<APIResponse> {
        return CliV2.postCliExecute(userContext, 'system status');
    }
}