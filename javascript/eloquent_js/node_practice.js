var http = require("http");
var fs = require("fs");

function req(accept) {
    var req = http.request({
        hostname: "eloquentjavascript.net",
        path: "/author",
        port: 80,
        method: "get",
        headers: {Accept: accept}
    }, function(response) {
        response.on("data", function(chunk) {
            console.log(accept);
            process.stdout.write(chunk.toString());
        })
    });
    req.end();
}

function practice1() {
    var accept = ["text/html", "text/plain", "application/json"];

    for (var i = 0; i < accept.length; i++) {
        req(accept[i]);
    }
}

var methods = Object.create(null);

http.createServer(function(request, response) {
    function respond(code, body, type) {
        if (!type) type = "text/plain";
        response.writeHead(code, {"Content-Type": type});
        if (body && body.pipe)
            body.pipe(response);
        else
            response.end(body);
    }

    if (request.method in methods)
        methods[request.method](urlToPath(request.url), respond, request);
    else
        respond(405, "Method " + request.method + " not allowed");
}).listen(8000);

function urlToPath(url) {
    var path = require("url").parse(url).pathname;
    return "." + decodeURIComponent(path);
}

methods.GET = function(path, respond) {
    fs.stat(path, function(error, stats) {
        if (error && error.code == "ENOENT")
            respond(404, "File not found");
        else if (error)
            respond(500, error.toString());
        else if (path === "./")
            respond(200, fs.createReadStream("nodepractice.html"), "text/html");
        else if (stats.isDirectory())
            fs.readdir(path, function(error, files) {
                if (error) 
                    respond(500, error.toString());
                else
                    respond(200, files.join("\n"));
            });
        else
            respond(200, fs.createReadStream(path), require("mime").lookup(path));
    });
};

methods.DELETE = function(path, respond) {
    fs.stat(path, function(error, stats) {
        if (error && error.code == "ENOENT")
            respond(204);
        else if (error)
            respond(500, error.toString());
        else if (stats.isDirectory())
            fs.rmdir(path, respondErrorOrNothing(respond));
        else
            fs.unlink(path, respondErrorOrNothing(respond));
    });
};

function respondErrorOrNothing(respond) {
    return function(error) {
        if (error)
            respond(500, error.toString());
        else
            respond(204);
    };
}

methods.PUT = function(path, respond, request) {
    var outStream = fs.createWriteStream(path);
    outStream.on("error", function(error) {
        respond(500, error.toString());
    });
    outStream.on("finish", function() {
        respond(204);
    });
    request.pipe(outStream);
};

methods.MKCOL = function(path, respond) {
    console.log("fuck");
    fs.mkdir(path, respondErrorOrNothing(respond));
};