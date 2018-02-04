# SnowLow API

## Stack:
* Node.js
* Typescript
* Aws Lambda
* Aws Dynamodb
* Dashbird or Cloudwatch for logs

##### serverless.yml:
* Contains serverless logic + 'routes'

##### Controllers:
* Contains all serverless handlers (versioning will happen here if needed)

##### Services:
* Contains business logic

##### Repositories:
* Contains database calls

##### Models:
* Contains data contracts