var PlayerManager = function() {
	this.players = new Array();
	this.ping_sent = new Date();
	
	this.init = function() {
		client_statics.socket.on("player_joined", this.spawn_player);
		client_statics.socket.on("status_update", this.update_player);
		client_statics.socket.on("update_stats", this.update_stats);
		client_statics.socket.on("pong", this.update_ping);
	};

	this.update_stats = function(message) {
		console.log("updating stats");
		client_statics.server_memory_usage.heapUsed = message.heapUsed;
		client_statics.server_memory_usage.heapTotal = message.heapTotal;
		console.log(client_statics.server_memory_usage);
	};

	this.update_ping = function(message) {
		console.log("got ping");
		var Now = new Date();
		var ping = Now - client_statics.player_manager.ping_sent;
		client_statics.ping = ping;
	}

	this.spawn_player = function(message) { 
		if(message.player_id == client_statics.player_id)
			return;

		client_statics.packets_received += 1;
		
		var nplayer = new NetworkPlayer(0,0, {image:"uparrow"});
		nplayer.player_id = message.player_id;
		me.game.add(nplayer, client_statics.player_z);
		me.game.sort();

		client_statics.player_manager.players.push(nplayer);
	};

	this.update_player = function(message) {
		client_statics.packets_received += 1;
		var p_found = client_statics.player_manager.get_player_by_id(message.player_id);
		if(!p_found)
			client_statics.player_manager.spawn_player(message);
		else {
			p_found.pos.x = message.pos_x;
			p_found.pos.y = message.pos_y;
			p_found.rotation = message.rot;
		}
	};

	this.get_player_by_id = function(id) {
		for(var p in client_statics.player_manager.players) {
			var play = client_statics.player_manager.players[p];
			if(play.player_id == id) {
				return play;
			}
		}	
		return null;	
	};
};