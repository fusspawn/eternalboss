function Renderer(canvas_id, client_object) 
{
    this.main_canvas = document.getElementById(canvas_id);
    this.main_canvas_context = this.main_canvas.getContext("2d");
    this.client = client_object;
    
    this.rendermodes = {
        NORMAL: 0,
        WIREFRAME: 1
    };
    
    this.screen_width = this.main_canvas.width;
    this.screen_height = this.main_canvas.height;
    this.rendered_bb = {x:0, y:0, width:0, height: 0};
    
    this.background_color = "black";
    
    this.stats = {};
    this.stats.buffer_blits = 0;
    this.stats.buffers_created = 0;
    this.stats.culled = 0;
    this.main_camera = null;
    
    client_data.draw_world = true;
    client_data.debug_text = false;
    client_data.debug_shapes = false;
    client_data.gui.__renderer = client_data.gui.addFolder("Rendering");
    client_data.gui.__renderer.add(client_data,'debug_text');
    client_data.gui.__renderer.add(client_data,'debug_shapes');
    client_data.gui.__renderer.add(client_data,'draw_world');
    
    client_data.gui.__renderer.add(this.stats, 'buffer_blits').listen();
    client_data.gui.__renderer.add(this.stats, 'buffers_created').listen();
    client_data.gui.__renderer.add(this.stats, 'culled').listen();
    
    this.draw_frame = function(delta) {};
    
    this.clear = function(only_dirty) 
    {
        this.stats.buffer_blits = 0;
        this.stats.culled =0;
        if(only_dirty) {
            this.main_canvas_context.fillRect(this.rendered_bb.x, this.rendered_bb.y, 
                  this.rendered_bb.width, this.rendered_bb.height);
        } else {
            this.main_canvas_context.save();
            this.main_canvas_context.fillStyle = this.background_color;
            this.main_canvas_context.fillRect(0,0, this.screen_width, this.screen_height);   
            this.main_canvas_context.restore();
        }
    };
    
    this.create_canvas_buffer = function(image_url, callback, context) {
            this.stats.buffers_created++;
            var rend = this;
            this.client.resources.get_image(image_url, function(image) {
                var ccontext = rend.__create_context(image.width, image.height);
                ccontext.drawImage(image, 0, 0);
                callback.call(context, ccontext);
            }, {});
    };
    
    this.__create_context = function(width, height) {
        var tmp_canvas = document.createElement("canvas");
        tmp_canvas.width = width;
        tmp_canvas.height = height;
        return tmp_canvas.getContext("2d");
    };
    
    this.__calc_redraw_bb = function(drawn_context, x, y) {
    };
    
    this.draw_buffer = function(buffer, x, y, width, height) { 
        if(buffer == null || buffer.canvas == null) {
            return;
        }
        
        if(this.main_camera != null) {
            x = x - this.main_camera.x;
            y = y - this.main_camera.y;
        }
        
        if(this.should_cull(x, y, width, height)) {
            this.stats.culled++;
            return; 
        }

        this.main_canvas_context.drawImage(buffer.canvas, x, y);
        this.stats.buffer_blits++;
    };
    
    this.draw_buffer_section = function(buffer, srcx, srcy, srcwidth, srcheight, x, y, width, height) {
        if(buffer == null || buffer.canvas == null) {
            return;
        }
        
        if(this.main_camera != null) {
            x = x - this.main_camera.x;
            y = y - this.main_camera.y;
        }
        
        
        if(this.should_cull(x, y, width, height)) {
            this.stats.culled++;
            return; 
        }
        
        if(!client_data.draw_world)
            return;
            
        this.main_canvas_context.drawImage(buffer.canvas, srcx, srcy, srcwidth, srcheight, x, y, width, height);
        this.stats.buffer_blits++;
    }; 
    
    this.draw_debug_box = function(x, y, width, height, color) {
        if(!client_data.debug_shapes)
            return;
        
        if(this.main_camera != null) {
            x = x - this.main_camera.x;
            y = y - this.main_camera.y;
        }
        if(this.should_cull(x, y, width, height)) {
            this.stats.culled++;
            return; 
        }
        this.main_canvas_context.save();
        this.main_canvas_context.strokeStyle = color;    
        this.main_canvas_context.strokeRect(x, y, width, height);
        this.main_canvas_context.restore();
    };    
    
    this.draw_debug_text = function(x, y, text, color) {
        if(!client_data.debug_text)
            return;
        
        if(this.main_camera != null) {
            x = x - this.main_camera.x;
            y = y - this.main_camera.y;
        }
        
        if(this.should_cull(x, y, 100, 100)) {
           this.stats.culled++;
           return; 
        }
        
        this.main_canvas_context.save();
        this.main_canvas_context.font = "8px Times New Roman";
        this.main_canvas_context.fillStyle = color;
        this.main_canvas_context.fillText(text, x, y);
        this.main_canvas_context.restore();
    };
     
    this.should_cull =  function(x, y, width, height) {
            if(x  > (this.main_canvas_context.width + width) || x < (0 - width)
                || y > (this.main_canvas_context.height + height) || y < (0 - height))
                return true; 
            
            return false;
    };
};
