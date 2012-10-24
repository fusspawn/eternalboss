function SpriteSheet(url, mappings) {
    this.sprite_mappings = mappings;
    this.url = url;
    this.context = null;
    this.isDrawable = true;
    this.current_frame = 0;
    
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.debug_color = "red";
    
    
    client_data.renderer.create_canvas_buffer(url, function(image) {
        this.context = image;
    }, this);
    
    
    this.update = function(delta) {
        
    }
    
    this.draw_at = function(x,y,delta) {
        this.x = x;
        this.y = y;
        this.draw(delta);
    }
    
    this.draw = function(delta) {
        var mappings = this.get_frame_rect(this.current_frame);
        
        if(mappings == null) {
            console.log("No TileMapping Data for tID: ", this.current_frame);
            return;
        }
        
        client_data.renderer.draw_buffer_section(this.context, mappings.x, mappings.y,
            this.width, this.height, this.x, this.y, this.width, this.height);
    };
    
    this.get_frame_rect = function(id) {
        return this.sprite_mappings[id];
    }
}