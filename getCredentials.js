async function getCredentials(login, password) {
    const { Parameters } = await new AWS.SSM()
      .getParameters({
        Names: ["CLIENT_ID"].map((secretName) => process.env[secretName]),
        WithDecryption: true,
      })
      .promise();
  
    const initiateAuthParams = {
      AuthFlow: "ADMIN_NO_SRP_AUTH",
      ClientId: Parameters[0].Value,
      UserPoolId: userPoolId,
      AuthParameters: {
        USERNAME: login,
        PASSWORD: password,
      },
    };
    return new Promise((resolve, reject) => {
      cognitoSP.adminInitiateAuth(initiateAuthParams, (authErr, authData) => {
        if (authErr) {
          reject(authErr);
        } else if (authData === null) {
          reject("Auth data is null");
        } else {
          resolve(authData.AuthenticationResult.IdToken);
        }
      });
    });
  }