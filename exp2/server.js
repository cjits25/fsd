const http = require("http");
const fs = require("fs");
const querystring = require("querystring");
const mysql = require("mysql2");

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",     // empty password allowed
    database: "exp2"
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL");
});

const server = http.createServer((req, res) => {
    
    // Serve login.html
    if (req.method === "GET" && req.url === "/") {
        fs.readFile("login.html", (err, data) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });
    }

    // Serve styles.css
    else if (req.method === "GET" && req.url === "/styles.css") {
        fs.readFile("styles.css", (err, data) => {
            res.writeHead(200, { "Content-Type": "text/css" });
            res.end(data);
        });
    }

    // Handle Login
    else if (req.method === "POST" && req.url === "/login") {
        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            const { username, password } = querystring.parse(body);

            const sql = "SELECT * FROM users WHERE username = ? AND password = ? LIMIT 1";

            db.query(sql, [username, password], (err, results) => {
                if (err) throw err;

                res.writeHead(200, { "Content-Type": "text/html" });

                if (results.length > 0) {
                    res.end(`<h2 style="color:green;text-align:center;">Login Successful! Welcome ${username}</h2>`);
                } else {
                    res.end(`<h2 style="color:red;text-align:center;">Invalid Username or Password</h2>`);
                }
            });
        });
    }

    // 404
    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
    }
});

// Start server
server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
