# executed with command npm run k6 /dist/k6/goto-page-test.js 
FROM grafana/k6:0.48.0
USER root

RUN apk update && apk add --no-cache chromium

ENV K6_BROWSER_ENABLED=true