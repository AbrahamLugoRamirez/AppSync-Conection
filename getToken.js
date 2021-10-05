
//NodeJs JavaScript
function getToken(event) {
    if (
      event.request &&
      event.request.headers &&
      event.request.headers.authorization
    ) {
      //For api calls
      console.log("1. Token included in request.headers");
      return Promise.resolve(event.request.headers.authorization);
    } else if (event.headers.tp2Token) {
      //For 3rd parties
      console.log("1. Token included in header");
      return Promise.resolve(event.headers.authorization);
    } else if (event.headers && event.headers.Authorization) {
      const auhtstr = Buffer.from(
        event.headers.Authorization.split(" ")[1],
        "base64"
      ).toString();
      const authArr = auhtstr.split(":");
      const username = authArr[0];
      const password = authArr[1];
      console.log("1. Token from basic auth");
      return getCredentials(username, password);
    } else {
      const errorData = new Error();
      errorData.error = errorCodes().general.groupNotAuthorizedError;
      errorData.statusCode = 401;
      console.log("1. No token nor auth information provided");
      return Promise.reject(errorData);
    }
  }