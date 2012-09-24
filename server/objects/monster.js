var Monster = function() {

	this.world = null;
	this._id = -1;
	this.hit_by_last = null;
	this.idle = true;
	this.pos = {x: 0, y:0};

	this.init = function(x, y, world, id) {
		this.world = world;
		this.pos.x = x;
		this.pos.y = y;
		this.id = id;
		this.world.send_message_to_world("mob_spawn", {id: this.id, pos_x: this.pos.x, pos_y: this.pos.y});
	};

	this.on_idle = function() {};
	this.on_hit = function(player) {};
	this.update = function() {
		
	};
};
modules.export = Monster;