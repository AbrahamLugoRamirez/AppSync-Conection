async function request(queryDetails, token) {
    const req = new AWS.HttpRequest(appsyncUrl, region);
    const endpoint = new urlParse(appsyncUrl).hostname.toString();
  
    req.method = "POST";
    req.path = "/graphql";
    req.headers.host = endpoint;
    req.headers["Content-Type"] = "application/json";
    req.headers["Authorization"] = token;
    req.body = JSON.stringify(queryDetails);
  
    return new Promise((resolve, reject) => {
      const httpRequest = https.request(
        {
          ...req,
          host: endpoint,
        },
        (response) => {
          var data = [];
          response.on("data", function (chunk) {
            data.push(chunk);
          });
          response.on("end", function () {
            resolve(JSON.parse(Buffer.concat(data).toString()));
          });
        }
      );
      httpRequest.write(req.body);
      httpRequest.end();
    });
  }
  