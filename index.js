const request = require("request"),
  fs = require("fs"),
  express = require("express"),
  app = express(),
  path = require("path");

getErrorDescription = function(errorCode) {
  var errorDescription = "System Failure - Contact Support!";
  if (errorCode === "ECONNREFUSED") {
    errorDescription = "Fuseki Server seems to be down. Please bring it up!";
  }
  return errorDescription;
};

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get("/semanticVocab/sync", (req, res) => {
  var formData = {
    my_file: fs.createReadStream(__dirname + "/Berlin.rdf")
  };

  request.post(
    { url: "http://localhost:3030/dss/data", formData: formData },
    function optionalCallback(err, httpResponse, body) {
      if (err) {
        console.error("upload failed:", err);
        console.log("Http Response Code =>" + httpResponse);
        res
          .status(500)
          .send(
            "Sync Error Encountered => " + getErrorDescription(err.code)
          );
      } else {
        console.log("Upload successful!  Server responded with:", body);
        res.status(200).send("Semantic Vocab Synchronized!");
      }
    }
  );
});

app.listen(3000, () => console.log("Server Started!"));
