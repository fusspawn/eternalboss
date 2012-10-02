function Renderer(canvas_id, client_object) 
{
    this.main_canvas = document.getElementById(canvas_id);
    this.main_canvas_context = this.main_canvas.getContext("2d");
    this.client = client_object;
    
    this.screen_width = this.main_canvas.width;
    this.screen_height = this.main_canvas.height;
    this.rendered_bb = {x:0, y:0, width:0, height: 0};
    
    this.draw_frame = function(delta) {};
    
    this.clear = function(only_dirty) 
    {
        if(only_dirty) {
            this.main_canvas_context.fillRect(this.rendered_bb.x, this.rendered_bb.y, 
                  this.rendered_bb.width, this.rendered_bb.height);
        } else {
            this.main_canvas.width = this.main_canvas.width;    
        }
    };
    
    this.create_canvas_buffer = function(image_url, callback) {
            var rend = this;
            this.client.resources.get_image(image_url, function(image) {
                var context = rend.__create_context(image.width, image.height);
                context.drawImage(image, 0, 0);
                callback(context);
            });
    };
    
    this.__create_context = function(width, height) {
        var tmp_canvas = document.createElement("canvas");
        return tmp_canvas.getContext("2d");
    };
    
    this.__calc_redraw_bb = function(drawn_context, x, y) {
    };
    
    this.draw_buffer = function(buffer, x, y) {
        this.main_canvas_context.drawImage(buffer.canvas, x, y);
    };
};
