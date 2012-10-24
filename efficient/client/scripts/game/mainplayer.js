function MainPlayer() {
    this.x = 0;
    this.y = 0;
    this.nextx = this.x;
    this.nexty = this.y;
    this.width = 0;
    this.height= 0;
    this.sprite = new Sprite();
    this.speed = 33;
    
    this.phys_object = {
        object: {
            x: this.x,
            y: this.y,
            width: 20,
            height: 20
        },
        
        type: "box"
    };
    
    this.last_frame = this.phys_object;
    
    client_data.scene.make_scene_object.call(client_data.scene, this);
    this.isUpdateable = true;
    this.isDrawable = true;
    
    this.update_physics = function() {
        this.phys_object.object.x = this.nextx;
        this.phys_object.object.y = this.nexty;
        
        if(client_data.physics.would_collide(this.phys_object))
        {
            return;
        }
        
        this.x = this.nextx;
        this.y = this.nexty;
    }
    
    
    this.update = function(delta) {        
        if(client_data.input.isKeyDown(client_data.input.keys.LEFT))
            this.nextx = this.x - (this.speed * (delta / 1000));
        if(client_data.input.isKeyDown(client_data.input.keys.RIGHT))
            this.nextx = this.x + (this.speed * (delta / 1000));
        if(client_data.input.isKeyDown(client_data.input.keys.UP))
            this.nexty = this.y - (this.speed * (delta / 1000));
        if(client_data.input.isKeyDown(client_data.input.keys.DOWN))
            this.nexty = this.y + (this.speed * (delta / 1000));     
        
        this.update_physics();
    };
    
    this.draw = function(delta) {
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.draw.call(this.sprite, delta);
    }; 
    
    this.move = function(x, y) {
        this.x = x;
        this.nextx = x;
        this.y = y;
        this.nexty = y;
    };
}