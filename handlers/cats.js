const url = require("url");
const fs = require("fs");
const path = require("path");
const qs = require("querystring");
const formidable = require("formidable");
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
            let catBreedPlaceholder = breeds.map((breed) => `<option value="${breed}">${breed}</option>`);
            let modifiedData = data.toString().replace('{{catBreeds}}', catBreedPlaceholder);
            res.write(modifiedData);

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
            // console.log("This is the var data: ", data); // Print <Buffer [bunch of hex data numbers]>
            formData += data;
            // console.log("This is var formData:", formData); // Prints my string input, e.g. This is var formData: breed=Ragdoll
        });

        req.on("end", () => {
            let body = qs.parse(formData);
            console.log("This is body: ", body); // E.g. This is body:  [Object: null prototype] { breed: 'Ragdoll' }

            fs.readFile("./data/breeds.json", (err, data) => {
                if(err) {
                    throw err;
                }

                let breeds = JSON.parse(data);
                console.log("This is breeds: ", breeds); // Reads breeds.json file as it is BEFORE data is pushed inside the array
                // E.g. This is breeds:  []
                breeds.push(body.breed);
                let json = JSON.stringify(breeds);
                console.log("This is json: ", json); // Reads breeds.json file as it is AFTER data is pushed inside the array
                // E.g. This is json:  ["Ragdoll"]

                fs.writeFile("./data/breeds.json", json, "utf-8", () => console.log("The breed was uploaded successfully"));
            });

            res.writeHead(302, {location: "/"});
            res.end();
        });
    } else if (pathname === '/cats/add-cat' && req.method === 'POST') {
        let form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            console.log("Fields: ", fields);
            console.log("Files: ", files);
            if (err) throw err;
            let oldPath = files.upload.path;
            console.log("This is oldPath: ", oldPath);
            let newPath = path.normalize(path.join(__dirname, "../content/images/" + files.upload.name));
            console.log("This is newPath: ", newPath);

            fs.rename(oldPath, newPath, (err) => {
                if(err) throw err;
                console.log("Files were uploaded successfully");
            });

            fs.readFile("./data/cats.json", "utf8", (err, data) => {
                let allCats = JSON.parse(data);
                allCats.push({ id: Date.now(), ...fields, image: files.upload.name});
                let json = JSON.stringify(allCats);
                fs.writeFile("./data/cats.json", json, () => {
                    res.writeHead(302, {location: "/"});
                    res.end();
                });
            });
        });
    } else {
        return true;
    }
};