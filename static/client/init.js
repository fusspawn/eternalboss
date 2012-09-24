
client_socket = null;

var jsApp = {
    onload: function() {
        if (!me.video.init('jsapp', 1024, 768, false, 1.0)) {
            alert("Sorry but your browser does not support html 5 canvas.");
            return;
        }
 
        me.audio.init("mp3, ogg");
        me.loader.onload = this.loaded.bind(this);
        me.loader.preload(g_resources);
        me.state.change(me.state.LOADING);
    },
    
    loaded: function() {
        // set the "Play/Ingame" Screen Object
        me.state.set(me.state.PLAY, new PlayScreen());
        me.state.set("restart", new DeadScreen());
        me.state.set("server-connect", new ServerConnectionScreen());
        me.state.change("server-connect");
    }
 
};

// jsApp
/* the in game stuff*/
var PlayScreen = me.ScreenObject.extend({
    onResetEvent: function() {
           client_statics.player_health = 0;
           client_statics.boss_health = 0;
           client_statics.player_manager = new PlayerManager();
           client_statics.player_manager.init();

           me.game.addHUD(0, 0, 1024, 768);
           me.entityPool.add("mainPlayer", PlayerEntity);
             
           // enable the keyboard
           me.input.bindKey(me.input.KEY.LEFT,  "left");
           me.input.bindKey(me.input.KEY.RIGHT, "right");
           me.input.bindKey(me.input.KEY.UP, "up");
           me.input.bindKey(me.input.KEY.DOWN, "down");
           me.input.bindKey(me.input.KEY.A,  "left");
           me.input.bindKey(me.input.KEY.D, "right");
           me.input.bindKey(me.input.KEY.W, "up");
           me.input.bindKey(me.input.KEY.S, "down");
           me.input.bindKey(me.input.KEY.SPACE, "attack", true);
           me.levelDirector.loadLevel("arena2_map");
    },
    onDestroyEvent: function() {
        me.game.disableHUD();
    }
 
});

var DeadScreen = me.ScreenObject.extend({
    onResetEvent: function() {
        me.input.bindKey(me.input.KEY.ENTER, "enter");
        me.game.add(new PressEnterToStart(20, 20, {image:"uparrow"}));
    }
});


var ServerConnectionScreen = me.ScreenObject.extend({
    onResetEvent: function() {
        client_statics.socket = io.connect(client_statics.host);  
        
        client_statics.socket.on('error', function (reason) {
            console.error('Unable to connect Socket.IO', reason);
        }); 

        client_statics.socket.on('initial_status', function(data) {
            console.log("Got initial_status packet: " + data)
            client_statics.player_id = data.player_id;
            client_statics.world_id = data.world_id;
            client_statics.packets_received += 1;
        });

        client_statics.socket.on("connect", function() {
            client_statics.update_stats = function() {
                client_statics.socket.emit("request_stats", {player_id: client_statics.player_id});
            };

            client_statics.update_ping = function() {
              client_statics.player_manager.ping_sent = new Date();
              client_statics.socket.emit("request_ping", {player_id: client_statics.player_id});
            };

            me.state.change(me.state.PLAY);
        });
    }
});

window.onReady(function() {
    jsApp.onload();
    gui = new dat.GUI();
    gui.addFolder("Game Info");
    gui.add(client_statics, 'player_health').listen();
    gui.add(client_statics, 'boss_health').listen();

    gui.addFolder("Server Info");
    gui.add(client_statics.server_memory_usage, 'heapTotal').listen();
    gui.add(client_statics.server_memory_usage, 'heapUsed').listen();
    gui.add(client_statics, "ping").listen();
    gui.add(client_statics, 'update_stats').listen();
    gui.add(client_statics, 'update_ping').listen();
});