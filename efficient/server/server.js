var app = require('http').createServer(static_handler)
  , socket = require('socket.io').listen(app)
  , fs = require('fs')
  , url = require('url')
  , path = require('path');

app.listen(8080);

server = {};
server.socket_man = socket;
server.socket_man.configure(function () {
       server.socket_man.set('transports', ['websocket']);
       server.socket_man.set("log level", 1);
});

server.socket_man.sockets.on('connection', function (socket) {
});




function static_handler(request, response) {

    var uri = url.parse(request.url).pathname,
        filename = path.join(process.cwd(), uri);

    path.exists(filename, function(exists) {
        if (!exists) {
            response.writeHead(404, {
                "Content-Type": "text/plain"
            });
            response.write("404 Not Found\n");
            response.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) {
            response.writeHead(302, {
                'Location': '../static/client_index.html'
            });

            response.end();
            return;
        }

        fs.readFile(filename, "binary", function(err, file) {
            if (err) {
                response.writeHead(500, {
                    "Content-Type": "text/plain"
                });
                response.write(err + "\n");
                response.end();
                return;
            }

            response.writeHead(200);
            response.write(file, "binary");
            response.end();
        });
    });
}
