const express = require("express");
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.urlencoded());

// Read the default template file when the server starts
const defaultTemplate = fs.readFileSync("./default.html", { encoding: "utf8", flag: "r" });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/home.html");
});

app.post("/", (req, res) => {
    const name = req.body.name;
    const quote = req.body.quote;
    const sendername = req.body.sendername;

    // Replace placeholders with user-specific data in the default template
    const personalizedData = defaultTemplate.replace("{{name}}", name).replace("{{quote}}", quote).replace("{{quots}}", quote).replace("{{sendername}}", sendername);

    // Write the personalized wish page with user-specific data
    fs.writeFileSync(`${name}.html`, personalizedData);

    res.redirect(`/${name}`);
});

app.get("/:name", (req, res) => {
    const { name } = req.params;

    try {
        const data = fs.readFileSync(`./${name}.html`, { encoding: "utf8", flag: "r" });
        res.send(data);
    } catch (error) {
        console.error("Error reading user's wish page:", error);
        res.status(500).send("Error reading user's wish page");
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
