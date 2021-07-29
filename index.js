const http = require("http");
// console.log("This is the server obj: ", http.createServer());
const port = 3000;
const handlers = require("./handlers");
// console.log(handlers);


http.createServer((req, res) => {
    // TESTING TO MAKE SURE SERVER IS WORKING
    // "req" is the incoming message
    // "res" is the server response
    // res.writeHead(200, {
    //     'Content-Type': 'text/plain'
    // });

    // res.write("Hello JS World!");
    // res.end();
    for (let handler of handlers) {
        if(!handler(req, res)) {
            break;
        }
    }

}).listen(port);