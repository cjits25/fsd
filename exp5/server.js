const http = require("http");
const fs = require("fs");
const querystring = require("querystring");

// Read JSON data
const data = JSON.parse(fs.readFileSync("data.json", "utf8"));

const server = http.createServer((req, res) => {

    // Serve CSS
    if (req.url === "/styles.css") {
        fs.readFile("styles.css", (err, css) => {
            res.writeHead(200, { "Content-Type": "text/css" });
            res.end(css);
        });
    }

    // Home Page - Restaurant List
    else if (req.url === "/" && req.method === "GET") {
        let restHtml = "";
        data.restaurants.forEach(r => {
            restHtml += `<a href="/menu?rest=${r.id}" class="btn">${r.name}</a><br><br>`;
        });

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
            <html>
            <head>
                <title>Food Delivery</title>
                <link rel="stylesheet" href="styles.css">
            </head>
            <body>
                <div class="container">
                    <h2>Food Delivery Website</h2>
                    <h3>Select Restaurant</h3>
                    ${restHtml}
                </div>
            </body>
            </html>
        `);
    }

    // Menu Page
    else if (req.url.startsWith("/menu") && req.method === "GET") {
        const query = new URL(req.url, "http://localhost").searchParams;
        const restId = query.get("rest");
        const restaurant = data.restaurants.find(r => r.id === restId);

        if (!restaurant) {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end("<h3>Restaurant not found</h3>");
            return;
        }

        let menuHtml = "";
        for (let item in restaurant.menu) {
            menuHtml += `
                <input type="checkbox" name="food" value="${item}">
                ${item} (Rs. ${restaurant.menu[item]})<br>
            `;
        }

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
            <html>
            <head>
                <title>${restaurant.name}</title>
                <link rel="stylesheet" href="styles.css">
            </head>
            <body>
                <div class="container">
                    <h2>${restaurant.name} - Menu</h2>
                    <form method="POST" action="/order?rest=${restaurant.id}">
                        ${menuHtml}<br>
                        <button type="submit" class="btn">Place Order</button>
                    </form>
                    <br>
                    <a href="/" class="link">Back</a>
                </div>
            </body>
            </html>
        `);
    }

    // Order Confirmation Page
    else if (req.url.startsWith("/order") && req.method === "POST") {
        const query = new URL(req.url, "http://localhost").searchParams;
        const restId = query.get("rest");
        const restaurant = data.restaurants.find(r => r.id === restId);

        let body = "";
        req.on("data", chunk => body += chunk.toString());

        req.on("end", () => {
            let formData = querystring.parse(body);
            let items = formData.food || [];

            if (!Array.isArray(items)) items = [items];

            let total = 0;
            items.forEach(item => {
                total += restaurant.menu[item];
            });

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(`
                <html>
                <head>
                    <title>Order Confirmation</title>
                    <link rel="stylesheet" href="styles.css">
                </head>
                <body>
                    <div class="container">
                        <h2>Order Confirmed</h2>
                        <p><b>Restaurant:</b> ${restaurant.name}</p>
                        <p><b>Items Ordered:</b> ${items.join(", ")}</p>
                        <p><b>Total Amount to Pay:</b> ${total}</p>
                        <p class="success">Thank you for your order!</p>
                        <a href="/" class="btn">Home</a>
                    </div>
                </body>
                </html>
            `);
        });
    }

    // Invalid URL
    else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h3>404 - Page Not Found</h3>");
    }
});

// Start Server
server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
