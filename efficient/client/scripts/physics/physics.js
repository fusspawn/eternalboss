Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};


function Physics() {        
    this.physics_objects = [];
    client_data.scene.make_scene_object.call(client_data.scene, this);
    this.isDrawable = true;
    this.debug_draw = true;
    
    client_data.gui.__renderer.add(this, "debug_draw");
    
    this.draw = function(delta) {
        if(!this.debug_draw)
            return;
        
        if(this.physics_objects.count < 1)
            return;
        
        var object;
        for(var i in this.physics_objects) {
              object = this.physics_objects[i].object;
              client_data.renderer.draw_debug_box(object.x, object.y, object.width, object.height, "pink");
        }
    };
    
    this.would_collide = function(object) {
        for(var i in this.physics_objects) {
            var func = this.get_collision_function(object, this.physics_objects[i]);
            if(func(object, this.physics_objects[i]))
                return true;
        }
        
        return false;
    }
    
    this.make_physics_object = function(object, type, values) {
       var obj = {
            object: object,
            type: type,
            data: values
       };
       
       this.physics_objects.push(obj);
       return this.physics_objects.length - 1;
    };
    
    
    this.get_collision_function = function(obj1, obj2) {
        var t_one = obj1.type;
        var t_two = obj2.type;
        
        if(this.physics_collision_functions[t_one+"-"+t_two] != null) 
        {
            return this.physics_collision_functions[t_one+"-"+t_two];
        } 
        else if(this.physics_collision_functions[t_two+"-"+t_one] != null)
        {
            return this.physics_collision_functions[t_two+"-"+t_one];
        }
        else 
        {
            return function(obj2, obj3) {
                console.log("Invalid Collision Function");
                return false;
            };
        }
    };
    
    this.physics_collision_functions = {};
    this.physics_collision_functions["box-circle"] = function(a, b) {
        if(a.type == "circle") {
            if(b.type == "box") {
                var tempa = a;
                a = b;
                b = tempa;
            }
        }
        
        var closest_x = b.object.x.clamp(a.object.x, a.object.x+a.object.width);
        var closest_y = b.object.y.clamp(a.object.y, a.object.y+a.object.height);
        var dist_x = a.object.x - closest_x;
        var dist_y = a.object.y - closest_y;
        var dist_square = (dist_x * dist_x) + (dist_y * dist_y);
        return dist_square < (b.object.radius * b.object.radius);
    };
    
    this.physics_collision_functions["box-box"] = function(a, b) {
        return !(
            ((a.object.y + a.object.height) < (b.object.y)) ||
            (a.object.y > (b.object.y + b.object.height)) ||
            ((a.object.x + a.object.width) < b.object.x) ||
            (a.object.x > (b.object.x + b.object.width))
        );
    };    
};

