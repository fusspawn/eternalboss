function Player() {
    client_data.scene.make_scene_object.call(client_data.scene, this);
    this.isUpdateable = true;
    this.isDrawable = true;
    
    this.sprite = new Sprite();
    this.name = "player";
    
    this.update = function(delta) {
        if(client_data.input.isKeyDown(client_data.input.keys.A)) {
            this.sprite.x -= 1;
        }
        if(client_data.input.isKeyDown(client_data.input.keys.D))
            this.sprite.x += 1;
        if(client_data.input.isKeyDown(client_data.input.keys.W))
            this.sprite.y -= 1;
        if(client_data.input.isKeyDown(client_data.input.keys.S))
            this.sprite.y += 1;
    }
    
    this.draw = function(delta) {
        this.sprite.draw.call(this.sprite, delta);    
    }
}