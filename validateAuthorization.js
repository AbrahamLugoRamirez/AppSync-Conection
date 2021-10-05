function validateAuthorization(token) {
    var base64Url = token.split(".")[1];
    var claims = JSON.parse(atob(base64Url));
    var data = {};
  
    if (!claims) {
      const errorData = new Error();
      errorData.error = errorCodes().general.userTokenError;
      errorData.statusCode = 401;
      console.log("2. No token claims founded");
      return Promise.reject(errorData);
    }
    data.username = claims["cognito:username"]
      ? claims["cognito:username"]
      : claims.username;
    if (!data.username) {
      const errorData = new Error();
      errorData.error = errorCodes().general.noUserError;
      errorData.statusCode = 403;
      console.log("2. No token claims['cognito:username'] founded");
      return Promise.reject(errorData);
    }
    const groups = claims["cognito:groups"];
    if (!groups) {
      const errorData = new Error();
      errorData.error = errorCodes().general.noGroupsError;
      errorData.statusCode = 403;
      console.log("2. No token claims['cognito:groups'] founded");
      return Promise.reject(errorData);
    }
  
    data.isAdmin = groups.indexOf("Admin") > -1;
    data.isCoordinator = groups.indexOf("Coordinator") > -1;
    data.isInvestigator = groups.indexOf("Investigator") > -1;
    data.isSubject = groups.indexOf("Subject") > -1;
    if (data.isSubject) {
      const errorData = new Error();
      errorData.error = errorCodes().general.groupNotAuthorizedError;
      errorData.statusCode = 403;
      console.log("2. Subject user api access denied");
      return Promise.reject(errorData);
    }
    if (!data.isAdmin && !data.isCoordinator && !data.isInvestigator) {
      const errorData = new Error();
      errorData.error = errorCodes().general.noValidGroupsError;
      errorData.statusCode = 403;
      console.log("2. Invalid user group");
      return Promise.reject(errorData);
    }
    data.userProjectsStr = claims["custom:projects"];
    data.userSitesStr = claims["custom:sites"];
    data.userSubjectsStr = claims["custom:subjects"];
    console.log("2. validateAuthorization OK");
    return Promise.resolve(data);
  }