const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 1337;

function serveStaticFile(res, filePath) {
  // Set default status code to 200 (OK) <-- Success
  let statusCode = 200;

  console.log("Before")

  // Try to read the file
  fs.readFile(filePath, (err, data) => {
    // If there is an error and its file not found error, serve 404 page
    if (err) {
      if (err.code === "ENOENT") {
        console.log("Serving error code 404")
        // Serve 404 page
        fs.readFile(path.join(__dirname, "public", "404.html"), (err, data) => {
          res.writeHead(404, { "Content-Type": "text/html" });
          res.end(data);
        });
      }
      return;
    }

    console.log("found file, trying to get it's extension")

    // Get content type based on file extension (These are the only ones we need for now)
    const ext = path.extname(filePath);
    console.log("Found the extension: ", ext)
    
      let contentType = "text/plain";
    switch (ext) {
      case ".html":
        contentType = "text/html";
        break;
      case ".css":
        contentType = "text/css";
        break;
      case ".js":
        contentType = "text/javascript";
        break;
      case ".png":
        contentType = "image/png";
        break;
      case ".jpg":
        contentType = "image/jpeg";
        break;
      case ".jpeg":
        contentType = "image/jpeg";
        break;
      case ".gif":
        contentType = "image/gif";
        break;
    }
    
    console.log("Found the extension: ", contentType)

    // Serve it
    res.writeHead(statusCode, { "Content-Type": contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  // Normalize the URL
  let url = req.url.split("?")[0].toLowerCase();
  if (url.endsWith("/")) {
    url = url.slice(0, -1); // Remove the trailing slash
  }

  

  // If no path specified, serve index.html (this is the home page)
  if (url === "") {
    url = "/index.html";
  }

  // If no extension, try adding .html
  if (path.extname(url) === "") {
    url = `${url}.html`;
  }
    
  console.log("url: ", url)

  // Create the file
  const filePath = path.join(__dirname, "public", url);


  console.log("Serving static file: ", filePath)
  // Serve the static file
  serveStaticFile(res, filePath);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

