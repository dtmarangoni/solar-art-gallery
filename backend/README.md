# Solar Art Gallery Backend

An AWS Lambda backend REST API built with Serverless framework for the fifth project of Udacity Cloud Developer Nanodegree.

## Installation instructions

The application is deployed in the cloud, but if you want to run it locally please follow the instructions below.

1. Requirements:

    - [Install Node.js](https://nodejs.org/en/) (tested with Node.Js 14);

2. In the project root folder, please run:

    - Download and install the required npm packages: `npm i`;
    - Install the DynamoDB locally: `serverless dynamodb install`;
    - Install the S3 Bucket plugin locally: `serverless plugin install --name serverless-s3-local`;

3. To start the local dev server, please run:

-   In root folder run: `npm run offline`

## REST API Endpoints

For details of each REST API endpoint, please check the [documentation](./rest-api-doc.md).

## Postman Collection

An alternative way to test the backend API without the frontend client is by using the Postman collection that contains sample requests.
You can find it in the project root folder

-   File named [solar-art-gallery.postman.json](./solar-art-gallery.postman.json)
-   Just import it in [Postman](https://www.postman.com/downloads/) application and start using the sample requests
-   You can also run the entire collection in correct order under _AWS -> Run - correct order_ folder

## Learn More

You can learn more in the [Serverless Framework documentation](https://www.serverless.com/framework/docs/).
