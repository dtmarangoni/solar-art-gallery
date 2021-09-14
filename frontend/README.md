# Solar Art Gallery Frontend

A frontend UI built with [Angular](https://angular.io/) and [Material Design Bootstrap UI](https://mdbootstrap.com/) for the fifth project of Udacity Cloud Developer Nanodegree.

## Installation instructions

To start the frontend application locally please follow the instructions below.

1. Requirements:

   - [Install Node.js](https://nodejs.org/en/) (tested with Node.Js 14);

2. In the project root folder, please run:

   - Download and install the required npm packages: `npm i`;

3. Set the current backend environment in file [environment.ts](./src/environments/environment.ts)

   - For Serverless framework running locally set in file
     - `apiHost: apiHostConfig.endpoints.dev`
   - For Serverless framework running in AWS cloud set in file
     - `apiHost: apiHostConfig.endpoints.prod`

4. To start the local dev server, please run:

   - In root folder run: `npm start`
