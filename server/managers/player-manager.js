require("underscore");
var Player = require("../objects/player.js");

var PlayerManager = function() {
    this.last_p_id = -1;
    this.players = [];

    this.init = function() {
        console.log("[Service] PlayerManager: Starting..");
    };
     
    this.incoming_player = function(socket) {

        socket.on('status_update', function(data) {
             var w = server.world_manager.get_world_by_id(data.world_id);
             w.handle_player_message(data);
        });

        socket.on("request_stats", function(data) {
            socket.emit("update_stats", process.memoryUsage());
        });

        socket.on("request_ping", function(data){
            console.log("sending _pong response");
            socket.emit("pong", {player_id: data.player_id});
        });

        console.log("[PlayerManager] got new player connection...");
        
        var player = new Player(this.get_player_id(), "unknown", socket);
        player.init();
        player.on_room_join(server.world_manager.get_player_room());
        this.players.push(player);

        var w = server.world_manager.get_world_by_id(player.world_id);
        w.send_message_to_world("player_joined", {player_id: player.player_id}, player.player_id);
    };
    
    this.get_player_id = function() {
        this.last_p_id += 1;
        return this.last_p_id;
    };

    this.get_player_by_id = function(id) {
        return this.players[id];
    };
};

module.exports = PlayerManager;

