import test, { APIResponse, expect } from '@playwright/test';
import { UserContext } from '@config/UserContext';
import { CliV2 } from '@controllers/v2_0/cliV2';
import { sleep } from '@utils/timeUtils';
import { PodName } from '@constants/podName';

export class CliAPISteps {

    /**
     * Restarts pods one by one.
     * @param userContext       - user that makes the API call
     * @param podNames          - pods names list
     * @param waitForAllPods    - should wait for all PODs to be running ot not
     */
    public static async restartSpecificPods(
        podNames: PodName[],
        userContext: UserContext,
        waitForAllPods: boolean = true,
    ): Promise<void> {
        await test.step(`Restart '${podNames.join(', ')}' pods and wait pods started via API by '${userContext.email
            }'`, async () => {
                for (const podName of podNames) {
                    await this.restartSpecificPod(podName, userContext);
                }
                if (waitForAllPods) {
                    await this.waitAllPodsRunning(userContext, 10);
                }
            });
    }

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

    /**
     * Waits for all pods running
     * @param userContext     - user that makes the API call
     * @param delaySeconds    - optional | delay before checking pods status (seconds)
     * @param timeoutSeconds  - timeout in seconds
     * @param intervalSeconds - interval in seconds between checking
     */
    public static async waitAllPodsRunning(
        userContext: UserContext,
        delaySeconds?: number,
        timeoutSeconds: number = 4 * 60,
        intervalSeconds: number = 3,
    ): Promise<void> {
        await test.step(`Wait all pods are started via API by '${userContext.email}'`, async () => {
            if (delaySeconds) await sleep(delaySeconds, 'before checking all pods status');
            console.log(`Wait all pods are started during ${timeoutSeconds} seconds...`);
            await this.waitCliReadyToUse(userContext);
            try {
                await expect(async () => {
                    expect(await this.areAllExistingPodsInRunningStatus(userContext)).toEqual(true);
                }).toPass({ timeout: timeoutSeconds * 1000, intervals: [intervalSeconds * 1000] });
                console.log('All pods started');
            } catch (error) {
                throw new Error(`Error: some pods still aren't running.`);
            } finally {
                console.log(await this.getAllExistingPodsAsTable(userContext));
            }
        });
    }

    /**
     * Waits for specific pods running
     * @param userContext   - user that makes the API call
     * @param podNames      - pod names list
     * @param delaySeconds  - optional | delay before checking pods status (seconds)
     */
    public static async waitSpecificPodsRunning(
        podNames: PodName[],
        userContext: UserContext,
        delaySeconds?: number,
    ): Promise<void> {
        await test.step(`Wait for '${podNames.join(', ')}' pod(s) running via API by '${userContext.email
            }'`, async () => {
                if (delaySeconds) await sleep(delaySeconds, 'before checking pods status');
                await this.waitCliReadyToUse(userContext);
                await expect(async () => {
                    expect(await this.areSpecificPodsInRunningStatus(podNames, userContext)).toEqual(
                        true,
                    );
                }).toPass({ timeout: 4 * 60 * 1000, intervals: [3 * 1000] });
                console.log(`'${podNames.join(', ')}' pods are running`);
            });
    }

    private static async areSpecificPodsInRunningStatus(
        pods: string[],
        userContext: UserContext,
    ): Promise<boolean> {
        const allPods: string[] = (await this.getAllExistingPodsAsTable(userContext)).split('\n');
        return this.arePodsRunning(allPods.filter((podName) => pods.includes(podName)));
    }

    private static arePodsRunning(pods: string[]): boolean {
        return pods.every((pod) => {
            return !pod.includes('Pending') && !pod.includes('Not Ready');
        });
    }

    private static async areAllExistingPodsInRunningStatus(
        userContext: UserContext,
    ): Promise<boolean> {
        const allPods: string = await this.getAllExistingPodsAsTable(userContext);
        return this.arePodsRunning(allPods.split('\n'));
    }

    /**
     * Waits for CLI is ready to be used
     * @param userContext - user that makes the API call
     */
    private static async waitCliReadyToUse(userContext: UserContext) {
        await test.step(`Wait for CLI is ready to be used via API by '${userContext.email}'`, async (): Promise<void> => {
            await expect(async () => {
                const res: APIResponse = await this.getAllPodsInformation(userContext);
                console.log(`Cli status code: ${res.status()}`);
                expect(res.status()).toBe(200);
            }).toPass({ timeout: 60 * 1000, intervals: [5 * 1000] });
        });
    }

    /**
     * Restarts specific pod and checks it's up and running
     *
     * @param userContext   - user that makes the API call
     * @param podName       - name of the pod to be restarted
     * @private
     */
    private static async restartSpecificPod(
        podName: PodName,
        userContext: UserContext,
    ): Promise<void> {
        const SUCCESSFUL_RESPONSE_BODY =
            'Service restarted, waiting until ready...\n' + 'Service restarted successfully';
        try {
            await this.waitCliReadyToUse(userContext);
            console.log(`Restarting '${podName}' pod: STARTED`);
            await expect(async () => {
                const response: string = await this.getPodRestartResponseBody(podName, userContext);
                expect(response.includes(SUCCESSFUL_RESPONSE_BODY)).toEqual(true);
            }).toPass({ timeout: 60 * 1000, intervals: [10 * 1000] });
            console.log(`Restarting '${podName}' pod: FINISHED`);
        } catch (error) {
            console.log(`Restarting '${podName}' pod: FAILED`);
            console.log(await this.getAllExistingPodsAsTable(userContext));
            throw new Error(
                `Restarting '${podName}' pod has been failed.\n` +
                `Actual response:\n` +
                `<<${await this.getPodRestartResponseBody(podName, userContext)}>>\n` +
                `Expected response:\n` +
                `<<${SUCCESSFUL_RESPONSE_BODY}>>`,
            );
        }
    }

    private static getRestartSpecificPodCommandString(podName: PodName): string {
        return `services restart -name ${podName} --skip-confirmation -wait-until-ready yes`;
    }

    private static async getPodRestartResponseBody(
        podName: PodName,
        userContext: UserContext,
    ): Promise<string> {
        const response: APIResponse = await CliV2.postCliExecute(
            userContext,
            this.getRestartSpecificPodCommandString(podName),
        );
        expect(response.status()).toBe(200);
        return response.text();
    }
}