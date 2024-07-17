import { execSync } from 'child_process';
import * as os from 'os';

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