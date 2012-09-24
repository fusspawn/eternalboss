var astar = require("../astar");
var arena_2 = require("./arena2.json");

var MapLoader = function() {
	this.map_object = {};
	this.map_object.tile_layers = [];
	this.map_object.collision_graph = null;
	this.map_object.player_spawn = null;
	this.map_object.mob_spawns = [];
 
	this.init = function() {
		this.load_in_tiles();
	};

	this.load_in_tiles = function() {
		this.map_object.height = arena_2.height;
		this.map_object.width = arena_2.width;
		this.map_object.tile_height = 16;
		this.map_object.tile_width = 16;
		this.map_object.tile_layers = [];
		this.map_object.collision_graph = new astar.Graph(this.map_object.height);

		for(var layer in arena_2.layers) {
			this.map_object.tile_layers[layer] = {};
			this.map_object.tile_layers[layer].width = arena_2.layers[layer].width;
			this.map_object.tile_layers[layer].height = arena_2.layers[layer].height;
			this.map_object.tile_layers[layer].name = arena_2.layers[layer].name;

			if(this.map_object.tile_layers[layer].name == "CollisionLayer") {
				console.log("found collision layer");
				var idx = 0;
				for ( var y = 0 ; y <this.height; y++) {
					for ( var x = 0; x <this.width; x++) {
						if(arena_2.layers[layer].data[idx++] > 0) {
							this.map_object.collision_graph.nodes[x][y].set();
							console.log("wall");
						} 
					}
				}
			}

			if(this.map_object.tile_layers[layer].name == "GameObjects")
			{
				

				for(var object_id in arena_2.layers[layer].objects) {
					var object = arena_2.layers[layer].objects[object_id]; 
					
					if(object.name == "mainPlayer") {
						console.log("found player_spawn: " +  object.x  / this.map_object.tile_width + ':' + object.y / this.map_object.tile_width);
						this.map_object.player_spawn = {x:object.x, y: object.y};
						
					} 

					if(object.name == "mob") {
						console.log('found mob spawn_point' + object.x  / this.map_object.tile_width + ":" + object.y / this.map_object.tile_width);
						this.map_object.mob_spawns.push({x: object.x, y: object.y });
					}
				}
			}
		}

		var p_spawn = this.map_object.player_spawn;
			p_spawn.x = Math.floor(p_spawn.x / 16);
			p_spawn.y = Math.floor(p_spawn.y / 16);

			console.log(p_spawn);
			console.log(this.map_objects);
		var to = this.map_object.collision_graph.nodes[p_spawn.x][p_spawn.y];

		for(var mob_spawn in this.map_object.mob_spawns) {

			var m_spawn = this.map_object.mob_spawns[mob_spawn];
			m_spawn.x = Math.floor(m_spawn.x / 16);
			m_spawn.y = Math.floor(m_spawn.y / 16);
			var from = this.map_object.collision_graph.nodes[m_spawn.x][m_spawn.y];
			var path = this.map_object.collision_graph.path(from.x, from.y, to.x, to.y, function(path){console.log("found_path of length: " + path);});
		} 
	};
};

module.exports = MapLoader;