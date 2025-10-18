export const environment = {
  production: false,
  apiBaseUrl: 'https://localhost:7142/api',
  msal: {
    clientId: '80831b22-7ddb-4f59-9230-56384d567f3d',
    tenantId:'433cd4ce-c27e-49d8-a23e-d216767f790c',
    authority: 'https://login.microsoftonline.com/433cd4ce-c27e-49d8-a23e-d216767f790c',
    redirectUri: 'http://localhost:4200',
    scopes:['api://80831b22-7ddb-4f59-9230-56384d567f3d/CampusOrbit.Access']
  },
  authConfig:{
    apiUrl:"https://localhost:7142/api/Users"
  }
};
