function TiledMap(url) {
    client_data.scene.make_scene_object.call(client_data.scene, this);
    this.isDrawable = true;
    this.isUpdateable = true;
    
    this.map = null;
    this.loaded = false;
    this.loading = 0;
    this.sprite_sheets = Array();
    this.global_mappings = {};
    this.create_world_physics = true;
    this.physics_layer_id = "Walls";
    
    client_data.resources.get_map(url, function(map_json) {
        this.map = map_json;
        console.log(this.map);
        this.process_sprite_sheets();  
        if(this.create_world_physics) {
            this.create_physics_from_layer(this.get_layer("Walls"));
        };
    }, this);
    
    
    this.create_physics_from_layer = function(layer) {
         var sheet = this.get_spritesheet(layer.name);
         for(var index = 0; index < layer.data.length; index++)  {
            var tid = layer.data[index];
            var x = index % layer.width;
            var y = index / layer.width | 0; 
               
            if(tid > 0)
            {
                client_data.physics.make_physics_object({x:x * this.map.tilewidth, y:y * this.map.tileheight, 
                    width: sheet.tilewidth, height: sheet.tileheight}, "box", {});
            }
        }
    };
    
    this.get_layer = function(layer_name) {
        for(var i in this.map.layers)
            if(this.map.layers[i].name == layer_name)
                return this.map.layers[i];
    };
    this.get_spritesheet = function(layer_name) {
        for(var i in this.map.tilesets)
            if(this.map.tilesets[i].name == layer_name)
                return this.map.tilesets[i];
    };
    
    this.process_sprite_sheets = function()
    {
        for(var index in this.map.tilesets) 
        {
            var ts = this.map.tilesets[index];
            var sheet_mappings = this.create_mappings(ts);
            var sprite = new SpriteSheet(ts.image, sheet_mappings);
            
            sprite.tilewidth = ts.tilewidth;
            sprite.tileheight = ts.tileheight;
            sprite.debug_color = "rgba("+Math.floor(Math.random() * 255)+ "," + 
                                        Math.floor(Math.random() * 255)+ "," +
                                        Math.floor(Math.random() * 255)+ ",255)";
            sprite.firstgid = ts.firstgid;
            this.update_global_mappings(sprite, sheet_mappings);
            this.sprite_sheets.push(sprite);
        }       
    };
    
    this.update_global_mappings = function(sprite, mappings) {
        for(var i in mappings) {
            mappings[i].sheet = sprite;
            this.global_mappings[i] = mappings[i];
            this.global_mappings[i].w  = sprite.width;
            this.global_mappings[i].h  = sprite.height;
        }
    };
    
    this.get_correct_sheet = function(id) {
        return this.global_mappings[id].sheet;
    };
    
    this.create_mappings = function(ts) {
        var sprite_width = ts.tilewidth;
        var sprite_height = ts.tileheight;
        
        var x_count = Math.floor(ts.imagewidth / sprite_width);
        var y_count = Math.floor(ts.imageheight / sprite_height);
        
        console.log("X count: ", x_count, " Y Count: ", y_count);
        
        var mapping = {};
        var gid = ts.firstgid;
        var _len = x_count * y_count;
        
        for(var i = 0; i < _len; i++) {
            var x = i % x_count;
            var y = i / x_count | 0;
            mapping[gid + i] = {
                x: x * sprite_width,
                y: y * sprite_height,
            };
        }
        
        return mapping;
    }

    this.update = function(delta) {
        if(this.map == null)
            return;
    };
    
    this.draw = function(delta) {
        if(this.map == null)
            return;
        
        for(var i = 0; i < this.map.layers.length; i++)
            this.draw_layer(delta, i);
    };
    
    this.get_safe_key = function(path) {
        var copy = path;
        copy.replace("/", "_");
        copy.replace("\\", "_");
        copy.replace(".", "_");
        copy.replace(":", "_");
        return copy;
    };
    
    this.draw_layer = function(delta, id) {
        var layer = this.map.layers[id];
        for(var index = 0; index < layer.data.length; index++) {
            var tid = layer.data[index];
            var x = index % layer.width;
            var y = index / layer.width | 0; 
               
            if(tid > 0)
            {
                var ss = this.get_correct_sheet(tid);
                    ss.current_frame = tid;
                    ss.width = ss.tilewidth;
                    ss.height = ss.tileheight;
                    
                    var _x = x * this.map.tilewidth;
                    var _y = y * this.map.tileheight;
                    
                    ss.draw_at(_x, _y, delta);
                    
                    client_data.renderer.draw_debug_text(x * this.map.tilewidth, y * this.map.tileheight,
                        tid, ss.debug_color);
            }
            
            //client_data.renderer.draw_debug_box(x * this.map.tilewidth, y * this.map.tileheight, 
              //      this.map.tilewidth, this.map.tileheight, "purple");
        }
    }; 
}