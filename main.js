// Node.js Core Modules
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const EventEmitter = require("events");
const os = require("os");
const zlib = require("zlib");
const { pipeline } = require("stream");
const { json } = require("node:stream/consumers");

function ensureFileExists(filePath, defaultContent = "") {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, defaultContent);
  }
}

// 1. Write a function that logs the current file path and directory.(0.5 Grade)
function logCurrentPath() {
  console.log({ file: __filename, dir: __dirname });
}

// 2. Write a function that takes a file path and returns its file name.(0.5 Grade)
function getFileName(filePath) {
  return path.basename(filePath);
}

// 3. Write a function that builds a path from an object (0.5 Grade)
function buildPath(object) {
  return path.format(object);
}

// 4. Write a function that returns the file extension from a given file path.(0.5 Grade)
function getFileExtension(filePath) {
  return path.extname(filePath);
}

// 5. Write a function that parses a given path and returns its name and ext.(0.5 Grade)
function getParses(filePath) {
  const fullData = path.parse(filePath);
  return {
    name: fullData.name,
    ext: fullData.ext,
  };
}

// 6. Write a function that checks whether a given path is absolute.(0.5 Grade)
function isAbsoLutePath(filePath) {
  return path.isAbsolute(filePath);
}

// 7. Write a function that joins multiple segments (0.5 Grade)
function joinPaths(...segments) {
  return path.join(...segments);
}

// 8. Write a function that resolves a relative path to an absolute one.(0.5 Grade)
function resolvePath(relativePath) {
  return path.resolve(relativePath);
}

// 9. Write a function that joins two paths.(0.5 Grade)
function joinTwoPaths(segments1, segments2) {
  return path.join(segments1, segments2);
}

// 10. Write a function that deletes a file asynchronously.(0.5 Grade)
function deleteFileAsync(filePath) {
  const fileName = path.basename(filePath);
  fs.unlink(filePath, (error) => {
    if (error) {
      console.error("Error deleting file:", error);
    } else {
      console.log(`The ${fileName} is deleted.`);
    }
  });
}

// 11. Write a function that creates a folder synchronously.(0.5 Grade)
function createFolderSync(folderPath) {
  fs.mkdirSync(folderPath);
  console.log(`Folder created at: ${folderPath}`);
}

// 12. Create an event emitter that listens for a "start" event and logs a welcome message.(0.5 Grade)
const myEmitter = new EventEmitter();
myEmitter.on("start", () => {
  console.log("Welcome event triggered!");
});
myEmitter.emit("start");

// 13. Emit a custom "login" event with a username parameter.(0.5 Grade)
const userEmitter = new EventEmitter();
userEmitter.on("login", (username) => {
  console.log(`User logged in: ${username}`);
});
userEmitter.emit("login", "Ahmed");

// 14. Read a file synchronously and log its contents.(0.5 Grade)
function readNoteFile(filePath) {
  ensureFileExists(filePath, "This is a sample note.");
  const content = fs.readFileSync(filePath, "utf-8");
  console.log(`the file content => "${content}"`);
}
readNoteFile("./notes.txt");

// 15. Write asynchronously to a file.(0.5 Grade)
function writeAsync(filePath, content) {
  fs.writeFile(filePath, content, (err) => {
    if (err) return console.error(err);
    console.log("File written successfully!");
  });
}
writeAsync("./async.txt", "Async save");

// 16. Check if a directory exists. (0.5 Grade)
function checkDirectoryExists(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch (err) {
    return false;
  }
}

// 17. Write a function that returns the OS platform and CPU architecture. (0.5 Grade)
function getSystemInfo() {
  return {
    Platform: os.platform(),
    Arch: os.arch(),
  };
}
console.log(getSystemInfo());

// 18. Use a readable stream to read a file in chunks and log each chunk. (0.5 Grade)
function readFileInChunks(filePath) {
  ensureFileExists(filePath, "This is a big file sample.");
  const readStream = fs.createReadStream(filePath, {
    encoding: "utf-8",
  });
  readStream.on("data", (chunk) => {
    console.log("--- Chunk Received ---");
    console.log(chunk);
  });
  readStream.on("error", (err) => {
    console.error("Error reading file:", err.message);
  });
}
readFileInChunks("./big.txt");

// 19. Use readable and writable streams to copy content from one file to another. (0.5 Grade)
function copyFileUsingStreams(sourcePath, destPath) {
  ensureFileExists(sourcePath, "This content will be copied.");
  const readStream = fs.createReadStream(sourcePath);
  const writeStream = fs.createWriteStream(destPath);
  readStream.pipe(writeStream);
  writeStream.on("finish", () => {
    console.log("File copied using streams");
  });
  readStream.on("error", (err) => {
    console.error("Error reading source file:", err.message);
  });
}
copyFileUsingStreams("./source.txt", "./dest.txt");

// 20. Create a pipeline that reads a file, compresses it, and writes it to another file. (0.5 Grade)
function compressFile(sourcePath, destPath) {
  ensureFileExists(sourcePath, "This content will be compressed.");
  const readStream = fs.createReadStream(sourcePath);
  const gzip = zlib.createGzip();
  const writeStream = fs.createWriteStream(destPath);
  pipeline(readStream, gzip, writeStream, (err) => {
    if (err) {
      console.error("Pipeline failed:", err.message);
    } else {
      console.log("Pipeline succeeded: File compressed successfully.");
    }
  });
}
compressFile("./data.txt", "./data.txt.gz");

// Simple CRUD Operations Using HTTP
// 1) Create an API that adds a new user to your users stored in a JSON file
const userPath = path.resolve("users.json");
http.createServer((req, res) => {
    if (req.url === "/user" && req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        const newUser = JSON.parse(body);
        const users = JSON.parse(fs.readFileSync(userPath, "utf-8"));
        const newId = users.length ? users[users.length - 1].id + 1 : 1;
        const addNewUser = {
          id: newId,
          name: newUser.name,
          age: newUser.age,
          email: newUser.email,
        };
        users.push(addNewUser);
        const newDataAdd = JSON.stringify(users);
        fs.writeFileSync(userPath, newDataAdd);

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(addNewUser));
      });
    }
    // 2) Create an API that updates an existing user's name, age, or email by their ID. The user ID should be retrieved from the URL
    else if (req.url.startsWith("/user/") && req.method === "PATCH") {
      const users = JSON.parse(fs.readFileSync(userPath, "utf-8"));
      const id = req.url.slice(6);
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        const updatedData = JSON.parse(body);
        const user = users.find((u) => u.id == id);
        if (user) {
          if (updatedData.name) {
            user.name = updatedData.name;
          }
          if (updatedData.age) {
            user.age = updatedData.age;
          }
          if (updatedData.email) {
            user.email = updatedData.email;
          }
          fs.writeFileSync(userPath, JSON.stringify(users));
          res.end(JSON.stringify(user));
        } else {
          res.end(JSON.stringify({ message: "User not found." }));
        }
      });
    }
    // 3) Create an API that deletes a User by ID. The user id should be retrieved from the URL
    else if (req.url.startsWith("/user/") && req.method === "DELETE") {
      const users = JSON.parse(fs.readFileSync(userPath, "utf-8"));
      const id = req.url.slice(6);
      const userIndex = users.findIndex((u) => u.id == id);
      if (userIndex !== -1) {
        const deletedUser = users.splice(userIndex, 1)[0];
        fs.writeFileSync(userPath, JSON.stringify(users));
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(deletedUser));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User not found." }));
      }
    }
    // 4) Create an API that gets all users from the JSON file.
    else if (req.url === "/user" && req.method === "GET") {
      const users = fs.readFileSync(userPath, "utf-8");

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(users);
    }
    // 5) Create an API that gets User by ID.
    else if (req.url.startsWith("/user/") && req.method === "GET") {
      const users = JSON.parse(fs.readFileSync(userPath, "utf-8"));
      const id = req.url.slice(6);
      res.writeHead(200, { "Content-Type": "application/json" });
      const user = users.find((u) => u.id == id);
      if (user) {
        res.end(JSON.stringify(user));
      } else {
        res.end(JSON.stringify({ message: "User not found." }));
      }
    }
  })
  .listen(3000);

// 2) Create an API that updates an existing user's name, age, or email by their ID. The user ID should be retrieved from the URL

// 3) Create an API that deletes a User by ID. The user id should be retrieved from the URL

// 4) Create an API that gets all users from the JSON file.
/**
 * const userPath = path.resolve("users.json");
http.createServer((req, res) => {
    if (req.url === "/user" && req.method === "GET") {
      const users = fs.readFileSync(userPath,"utf-8");
      res.writeHead(200, { "Content-Type": "application/json"});
      res.end(users);
    }
  })
  .listen(3000);
 */

// 5) Create an API that gets User by ID.
// http.createServer((req, res) => {
//     if (req.url.startsWith("/user/") && req.method === "GET") {
//       const users = JSON.parse(fs.readFileSync(userPath, "utf-8"));
//       const id = req.url.slice(6);
//       res.writeHead(200, { "Content-Type": "application/json" });
//       const user = users.find((u) => u.id == id);
//       if (user) {
//         res.end(JSON.stringify(user));
//       } else {
//         res.end(JSON.stringify({ message: "User not found." }));
//       }
//     }
//   })
//   .listen(3000);
