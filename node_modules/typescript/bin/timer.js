function TimerManager() {
    
    this.current_time = Date.now();
    this.animation_timer_funcs = new Array();
    this.update_timer_funcs = new  Array();
    this.other_timers = new Array();
    
    
    this.on_request_frame = function() {
            requestAnimationFrame(this.on_request_frame);
    };
}