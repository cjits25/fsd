const fs = require("fs");

// 1. Write data to a file
fs.writeFile("sample.txt", "This is the initial content.\n", (err) => {
    if (err) throw err;
    console.log("File created and data written!");

    // 2. Read the file
    fs.readFile("sample.txt", "utf8", (err, data) => {
        if (err) throw err;
        console.log("File Content:");
        console.log(data);

        // 3. Append data to the file
        fs.appendFile("sample.txt", "This line is appended.\n", (err) => {
            if (err) throw err;
            console.log("Data appended to file!");

            // 4. Rename the file
            fs.rename("sample.txt", "new_sample.txt", (err) => {
                if (err) throw err;
                console.log("File renamed to new_sample.txt");

                // 5. Delete the file
                fs.unlink("new_sample.txt", (err) => {
                    if (err) throw err;
                    console.log("File deleted successfully!");
                });
            });
        });
    });
});
