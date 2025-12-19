// server.js

const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {

    // Parse URL and get query string data
    const q = url.parse(req.url, true).query;

    // If no data, show form
    if (!q.name && !q.age) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
		<center>
		<div>
            <h2>Enter Your Details</h2>
            <form method="GET" action="/">
                <input type="text" name="name" placeholder="Enter Name" required><br><br>
                <input type="number" name="age" placeholder="Enter Age" required><br><br>
                <button type="submit">Submit</button>
            </form>
		</div>
		</center>
        `);
    } 
    else {
        // Data available → generate response
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
            <h2>Form Submitted Successfully!</h2>
            <p><b>Name:</b> ${q.name}</p>
            <p><b>Age:</b> ${q.age}</p>
        `);
    }
});

// Start server
server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
