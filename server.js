const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 1337;

function serveStaticFile(res, filePath) {
  // Set default status code to 200 (OK) <-- Success
  let statusCode = 200;

  // Try to read the file
  fs.readFile(filePath, (err, data) => {
    // If there is an error and its file not found error, serve 404 page
    if (err) {
      if (err.code === "ENOENT") {
        // Serve 404 page
        fs.readFile(path.join(__dirname, "public", "404.html"), (err, data) => {
          res.writeHead(404, { "Content-Type": "text/html" });
          res.end(data);
        });
      }
      return;
    }

    // Get content type based on file extension (These are the only ones we need for now)
    const ext = path.extname(filePath);
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
    }

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

  // Create the file
  const filePath = path.join(__dirname, "public", url);

  // Serve the static file
  serveStaticFile(res, filePath);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

