function ResourceLoader(client_object) {
    
    this.client = client_object;
    this.cache_obj = {};
    this.get_resource = function(url, type, callback)
    {
        //if(this.cache_obj[type][url] != null) {
        //    callback(this.cache_obj[type][url]);
        //    return;
        //}
        
        
        if(type == "image")
        {
            var image = new Image(); 
            image.src = url;
            image.onload = function() {
                 //this.cache_obj[type][url] = image;
                 callback(image);
            }            
        }
    };
    
    
    this.get_image = function(url, cb) { return this.get_resource(url, "image", cb);  };
}