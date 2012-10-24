function ResourceLoader(client_object) {
    
    this.client = client_object;
    this.cache_obj = {"image":{},
                      "audio":{},
                      "map": {}};
    
    this.get_safe_key = function(path) {
        var copy = path;
        copy.replace("/", "_");
        copy.replace("\\", "_");
        copy.replace(".", "_");
        copy.replace(":", "_");
        return copy;
    };
    
    
    this.get_resource = function(url, type, callback, context)
    {
        var that = this;
        var key = this.get_safe_key(url);
        
        if(this.cache_obj[type][key] != null) {
            callback.call(context, this.cache_obj[type][key]);
            console.log(key + " : from cache");
            return;
        }
        
        
        if(type == "image")
        {
            console.log(key + " : fresh");
            var image = new Image(); 
            image.src = url;
            image.onload = function() {
                 that.cache_obj[type][key] = image;
                 callback.call(context, image);
            }            
        }
        
        if(type == "map") {
            console.log(key + ": fresh");
            $.getJSON(url, function(data) {
                that.cache_obj[type][key] = data;
                callback.call(context, data);
            });
        }
    };
    
    this.get_map = function(url, cb, context) { return this.get_resource(url, "map", cb, context); };
    this.get_image = function(url, cb, context) { return this.get_resource(url, "image", cb, context);  };
}