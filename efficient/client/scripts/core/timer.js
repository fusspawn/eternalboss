function TimerManager() {
    this.current_time = (new Date()).getTime();
    this.animation_timer_funcs = new Array();
    this.update_timer_funcs = new  Array();
    this.other_timers = new Array();
    this.request_id = null;
    this.fps = 0;
    this.update_fps = false;
    this.name = "Timer";
    this.elapsed_time = 0;
    
    this.timers_paused = false;
    
    var t = client_data.gui.add(this, 'timers_paused');
    t.onFinishChange(function(value) {
        client_data.timer.timers_paused = value;
    });
    
    this.on_request_frame = function() {
            client_data.renderer.clear();
            var frameDelta = (new Date()).getTime() - client_data.timer.current_time;
            client_data.timer.request_id = window.requestAnimationFrame(client_data.timer.on_request_frame);
            
            
            if(this.timers_paused)
                return;
                
            for(var index in client_data.timer.animation_timer_funcs) {
                var event_data = client_data.timer.animation_timer_funcs[index];
                event_data.f.call(event_data.c, frameDelta);
            }
            
            
            client_data.timer.fps++;
            client_data.timer.current_time = (new Date()).getTime();
            client_data.timer.elapsed_time += frameDelta;
            
            if(client_data.timer.update_fps && client_data.timer.elapsed_time >= 500) {
                $("#fps_display").text("FPS: " + (client_data.timer.fps * 2));
                client_data.timer.elapsed_time = 0;
                client_data.timer.fps = 0;
            }
    };
    
    this.push_frame_func = function(func, context) {
        if(context == null)
            context = {};
            
        client_data.timer.animation_timer_funcs.push({f: func, c: context});
    };
    
    
    this.start_loop = function() {
        client_data.timer.on_request_frame();
    };
}