export default {
    handler: `${__dirname.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}/handler.main`,
    environment: {
        AUTH0_JWKS_URI: '${env:AUTH0_JWKS_URI}',
        AUTH0_AUDIENCE: '${env:AUTH0_AUDIENCE}',
        AUTH0_ISSUER: '${env:AUTH0_ISSUER}',
    },
};
