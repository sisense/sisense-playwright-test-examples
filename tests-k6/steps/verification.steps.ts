import { RefinedResponse, ResponseType } from 'k6/http';
import { check } from 'k6';

export function checkResponse(
    response: RefinedResponse<ResponseType>,
    statusCode: number,
    message: string = '',
    showLogsIfSuccess: boolean = false,
    checkResponseError: boolean = true,
) {
    console.log(`${response.request.method} ${response.request.url}: ${response.status}`);
    if (showLogsIfSuccess || (statusCode !== response.status)) {
        console.error(`Request headers: ${JSON.stringify(response.request.headers)}`);
        console.error(`Request cookies: ${JSON.stringify(response.request.cookies)}`);
        console.error(`Request body: ${response.request.body}`);
        console.error(`Response headers: ${JSON.stringify(response.headers)}`);
        console.error(`Response body: ${response.body}`);
        console.error(`Response error: ${response.error}`);
        console.error(`Response error code: ${response.error_code}`);
    }
    check(response, {
        [message + ' status code is ' + response.status]: () => statusCode === response.status,
    });
    if (checkResponseError) {
        check(response, {
            [message + " response does not contain 'error'"]: () =>
                response.body ? !JSON.stringify(response.body).includes('error') : true,
        });
    }
}
