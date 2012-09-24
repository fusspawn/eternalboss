require("underscore");

var Player = function(id, name, socket) 
{
    this.id = id;
    this.name = name;
    this.socket = socket;
    this.world_id = null;

    this.player_data = {x: 0, y: 0, rot: 0};
    
    this.init = function() {
    };
    
    this.send_packet = function(event, packet) {
        this.socket.emit(event, packet);
    };
    
    this.on_status_change = function(packet) {
        this.player_data.x = packet.pos_x;
        this.player_data.y = packet.pos_y;
        this.player_data.rot = packet.rot;
    };
    
    this.on_room_join = function(world) {
        this.world_id = world.world_id;
        this.send_packet("initial_status", {player_id: this.id, world_id: world.world_id});
        world.register_player(this);
    };
};

module.exports = Player;