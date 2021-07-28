const url = require("url");
const fs = require("fs");
const path = require("path");
const qs = require("querystring");
// const formidable = require("formidable");
const breeds = require("../data/breeds");
const cats = require("../data/cats");

module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;

    if(pathname === '/cats/add-cat' && req.method === 'GET') {
        let filepath = path.normalize(
            path.join(__dirname, '../views/addCat.html')
        );
        
        const index = fs.createReadStream(filepath);

        index.on("data", (data) => {
            res.write(data);
        });

        index.on("end", () => {
            res.end();
        });

        index.on("error", (err) => {
            console.log(err);
        });
    } else if (pathname === '/cats/add-breed' && req.method === 'GET') {
        let filepath = path.normalize(
            path.join(__dirname, '../views/addBreed.html')
        );
        
        const index = fs.createReadStream(filepath);

        index.on("data", (data) => {
            res.write(data);
        });

        index.on("end", () => {
            res.end();
        });

        index.on("error", (err) => {
            console.log(err);
        });
    } else if (pathname === '/cats/add-breed' && req.method === 'POST') {
        let formData = "";

        req.on("data", (data) => {
            console.log("This is the var data: ", data); // Print <Buffer [bunch of hex data numbers]>
            formData += data;
            console.log("This is var formData:", formData); // Prints my string input
        });

        req.on("end", () => {
            let body = qs.parse(formData);

            fs.readFile("./data/breeds.json", (err, data) => {
                if(err) {
                    throw err;
                }

                let breed = JSON.parse(data);
                breeds.push(body.breed);
                let json = JSON.stringify(breeds);

                fs.writeFile("./data/breeds.json", json, "utf-8", () => console.log("The breed was uploaded successfully"));
            });

            console.log("Running up to here");

            res.writeHead(302, {location: "/"});
            res.end();
        });
    } else if (pathname === '/cats/add-cat' && req.method === 'POST') {

    } else {
        return true;
    }
};