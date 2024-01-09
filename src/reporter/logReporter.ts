import { Reporter, TestCase, TestResult, TestStep } from '@playwright/test/reporter';

class LogReporter implements Reporter {
    onTestBegin(test: TestCase, result: TestResult): void {
        const message = `TEST START: '${test.title}`;
        this.printLogInStdoutAndConsole(result, message);
    }

    onTestEnd(test: TestCase, result: TestResult): void {
        const message = `TEST END: '${test.title}'\nTEST RESULT: ${result.status.toUpperCase()}`;
        this.printLogInStdoutAndConsole(result, message);
    }

    onStepBegin(test: TestCase, result: TestResult, step: TestStep): void {
        if (this.isTestStep(step) && !this.isHook(step.title)) {
            const message = `STEP: '${step.title}'`;
            this.printLogInStdoutAndConsole(result, message, step);
        }
        if (this.isHook(step.title)) {
            const message = `HOOK START: '${step.title}'`;
            this.printLogInStdoutAndConsole(result, message, step);
        }
    }

    onStepEnd(test: TestCase, result: TestResult, step: TestStep): void {
        if (this.isHook(step.title)) {
            const message = `HOOK END: '${step.title}'`;
            this.printLogInStdoutAndConsole(result, message, step);
        }
    }

    printsToStdio(): boolean {
        return false;
    }

    private isHook(stepTitle: string): boolean {
        return stepTitle.toLowerCase().includes('hook');
    }

    private isTestStep(step: TestStep): boolean {
        return step.category.includes('test.step');
    }

    private printLogInStdoutAndConsole(result: TestResult, message: String, step?: TestStep) {
        const time = step ? `${this.getStepTime(step)}: ` : '';
        result.stdout.push(`${time}${message}\n`);
        console.log(message);
    }

    private getStepTime(step: TestStep) {
        return step.startTime.toLocaleTimeString('en-GB');
    }
}

export default LogReporter;
