function WorldMap() {
    client_data.scene.make_scene_object.call(client_data.scene, this);
    this.isDrawable = true;
    this.isUpdateable = true;
    this.name = "world_map";
    
    
    
    this.world = [[1,0,0, 0,2,0, 0,0,0],
                  [0,1,0, 2,0,0, 0,0,0],
                  [0,0,1, 0,2,0, 0,0,0],
                  [0,1,0, 0,0,2, 0,0,0],
                  [1,0,0, 0,2,0, 0,0,0],
                  [0,1,0, 2,0,0, 0,0,0],
                  [0,0,1, 0,2,0, 0,0,0],
                  [0,1,0, 0,0,2, 0,0,0],
                  [1,0,0, 0,2,0, 0,0,0]];
    
    this.world_width = 9;
    this.world_height = 9;
    this.world_tiles = new SpriteSheet("./Cobblesnow.png", [{x: 0, y: 0, w: 20, h: 20},
                                                            {x: 20, y: 0, w: 20, h: 20},
                                                            {x: 40, y: 0, w: 20, h: 20}]);
    
    this.update = function(delta) {}
    this.draw = function(delta) {
        
        for(var x=0; x < client_data.map.world_width; x++) {
            for(var y = 0; y < client_data.map.world_height; y++) {
                client_data.map.world_tiles.x = x * 20;
                client_data.map.world_tiles.y = y * 20;
                client_data.map.world_tiles.current_frame = client_data.map.world[y][x];
                client_data.map.world_tiles.update.call(client_data.map.world_tiles, delta);
                client_data.map.world_tiles.draw.call(client_data.map.world_tiles, delta);
            }
        }
        
    }
}