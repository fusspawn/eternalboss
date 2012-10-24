function Scene() {
    this.SceneObjects = [];
    this.name = "Scene";
    
    this.update_scene = function(delta) {
        for(var index in this.SceneObjects) {
            var object = this.SceneObjects[index];
            
            if(object.isUpdateable != null 
                && object.update != null) {
                    object.update(delta);
                }
        }
    };
    
    this.draw_scene = function(delta) {
        for(var index in this.SceneObjects) {
            var object = this.SceneObjects[index];
            
            if(object.isDrawable != null &&
                object.draw != null) {
                    object.draw(delta);
                }
        }
    };
    
    
    this.make_scene_object = function(object) {
        
        this.SceneObjects.push(object);
        object.IsUpdateable = false;
        object.IsDrawable = false;
        console.log("scene count: " + this.SceneObjects.length);
    
    };
}