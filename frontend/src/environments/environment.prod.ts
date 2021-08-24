import { apiHostConfig } from '../config/api-host-config';
import { auth0Config } from '../config/auth0-config';

export const environment = {
  production: true,
  auth: { ...auth0Config, redirectUri: window.location.origin },
  apiHost: apiHostConfig.endpoints.prod,
};
