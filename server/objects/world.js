var _ = require("underscore");
var MapLoader = require("./map_loader.js");
var Arena2 = require("./arena2.json");

var World = function() {
    this.world_id = -1;
    this.world_data = null;
    this.name = "Unknown_World";
    this.players = [];
    this.mobs = [];
    this.mob_index = 0;
    
    this.init = function(name) {
        this.name = name;
        console.log("[World] WorldManager: Starting World: " + name + "id:" + this.world_id);
        this.set_world_map(Arena2);
    };
    
    this.register_player = function(player) {
        this.players.push(player);
        this.send_message_to_world("player_joined", {player_id: player.player_id}, player.player_id);
        console.log("sending player_joined event");
    };
    
    this.set_world_map = function(map) {
        var map_loader = new MapLoader(map);
        map_loader.init();
        this.world_data = map_loader;
    };    

    this.spawn_mobs = function() {
        for(var i in this.world_data.mob_spawns) {
            this.mobs.push(new Monster(this.world_data.mob_spawns[i].x, this.world_data.mob_spawns[i].y, this, this.mob_index));
            this.mob_index += 1;
        }
    }
    
    this.update_world_state = function(delta) {
        
    };   
    
    this.send_message_to_world = function(event, data, excludeid) {
        _.each(this.players, function(player){
            if(player.player_id != excludeid)
                player.socket.emit(event, data);
        });
    };
    
    this.handle_player_message = function(message) {
        var pid = message.player_id;
        var player = server.player_manager.get_player_by_id(pid);
        var type = message.type;

        if(type == "status") {
                player.on_status_change(message);
                this.send_message_to_world("status_update", message, pid);
        }
    };
};

module.exports = World;