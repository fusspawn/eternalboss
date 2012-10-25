function Sprite(image_url, x, y) {
    
    this.isUpdateable = true;
    this.isDrawable = true;
    this.name = "Sprite";
    
    this.x = 0;
    this.y = 0;
    
    this.id = "test";
    
    client_data.renderer.create_canvas_buffer("uparrow.jpg", function(image) {
        this.image = image;
    }, this);
    
    this.update = function(delta) { 
        
    }
    
    this.draw = function(delta) {  client_data.renderer.draw_buffer(this.image, this.x, this.y); } //
}