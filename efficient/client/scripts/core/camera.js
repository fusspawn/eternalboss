function Camera() {
    this.x = 0;
    this.y = 0;
    
    
    
    client_data.scene.make_scene_object.call(client_data.scene, this);
    this.isUpdateable = true;
    
    
    this.update = function(delta) {
        if(this.follow) {
            this.x = this.follow.x - (client_data.renderer.screen_width / 2);
            this.y = this.follow.y - (client_data.renderer.screen_height / 2);
        } else {
            if(client_data.input.isKeyDown(client_data.input.keys.LEFT))
                this.x -= 1;
            if(client_data.input.isKeyDown(client_data.input.keys.RIGHT))
                this.x += 1;
            if(client_data.input.isKeyDown(client_data.input.keys.UP))
                this.y -= 1;
            if(client_data.input.isKeyDown(client_data.input.keys.DOWN))
                this.y += 1;    
        }
    }
};