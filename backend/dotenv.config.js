/**
 * Load local .env variables using dotenv. 
 */
const dotenv = require('dotenv');

module.exports = async ({ options, resolveConfigurationProperty }) => {
  // Load env vars into Serverless environment
  const envVars = dotenv.config({ path: '.env' }).parsed;
  return envVars;
};