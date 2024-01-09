import { execSync } from 'child_process';
import { envConfig } from '@config/env.config';
import * as os from 'os';

/**
 * Executes sh commands on the remote host
 * For multiple commands execution please use '"command1 && command2"' construction
 */
export async function sh(command: string): Promise<void> {
    if (!os.type().includes('Window')) {
        command = `ssh -tt -i ${envConfig.localConfigDirectory}/${envConfig.hostCertFileName} -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no sisense@${envConfig.host} ${command}`;

        console.log(`Shell command executing: '${command}'`);
        const output: string = execSync(command, { encoding: 'utf-8' });
        console.log(`Shell command output:\n ${output}`);
    } else {
        console.warn(
            `Shell command is not supported on ${os.type()}. Following command wasn't executed:\n '${command}'`,
        );
    }
}

/**
 * Executes sh commands locally
 * For multiple commands execution please use '"command1 && command2"' construction
 */
export async function local_sh(command: string): Promise<void> {
    if (!os.type().includes('Window')) {
        console.log(`Shell command executing: '${command}'`);
        const output: string = execSync(command, { encoding: 'utf-8' });
        console.log(`Shell command output:\n ${output}`);
    } else {
        console.warn(
            `Shell command is not supported on ${os.type()}. Following command wasn't executed:\n '${command}'`,
        );
    }
}

export async function runKubectlGetPodsStatusAndWriteIntoFile(fileName: string): Promise<void> {
    await sh(
        `kubectl -n sisense get pods -o wide | tee ${envConfig.localLogsDirectory}/${fileName}`,
    );
}

export async function runKubectlGetEventsAndWriteIntoFile(fileName: string): Promise<void> {
    await sh(
        `kubectl get events --sort-by='.metadata.creationTimestamp' -A >> ${envConfig.localLogsDirectory}/${fileName}`,
    );
}
