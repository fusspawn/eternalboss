function Input() {
    this.keys = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        A: 65,
        W: 87,
        S: 83,
        D: 68,
        E: 69,
        SPACE: 32,
        ENTER: 13,
        LCTRL: 17,
        LSHIFT: 16
    };
    
    this.__pressed = {};
    
    this.isKeyDown = function(Key) {
        var down = client_data.input.__pressed[Key];
        return down;
    };
    
    this.keyDown = function(KeyCode) {
        client_data.input.__pressed[KeyCode.keyCode] = true;
    } 
    
    this.keyUp = function(KeyCode) {
        delete client_data.input.__pressed[KeyCode.keyCode];
    }
    
    
    
    
    window.addEventListener('keyup', this.keyUp, false);
    window.addEventListener('keydown', this.keyDown, false);
    
};