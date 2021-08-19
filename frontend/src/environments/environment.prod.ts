import { auth0Config } from '../config/auth0-config';

export const environment = {
  production: true,
  auth: {
    domain: auth0Config.domain,
    clientId: auth0Config.clientId,
    redirectUri: window.location.origin,
  },
};
