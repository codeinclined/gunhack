/*
 * Gunhack
 * A procedurally generated FPS using raycasting
 *
 * input.js
 *
 * Defines the Input constructor and prototype.
 *
 * Copyright (c) 2016 Joshua W Taylor
 * This code is licensed under The MIT License.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
*/

gh.Keyboard = {
    initialized: false,
    state: {
        "moveForward": 0,
        "rotate": 0,
        "strafe": 0,
        "debug": 0
    },
    keyAssignments: [],
    Initialize: function() {
        if (gh.Keyboard.initialized)
            return;

        window.addEventListener("keydown", function(e) {
            var action;

            if (e.keyCode > gh.Keyboard.keyAssignments.length)
                return;

            action = gh.Keyboard.keyAssignments[e.keyCode];
            if (action !== undefined && action[0] in gh.Keyboard.state)
            {
                e.preventDefault();
                gh.Keyboard.state[action[0]] = action[1];
            }
        }, false);

        window.addEventListener("keyup", function(e) {
            var action;

            if (e.keyCode > gh.Keyboard.keyAssignments.length)
                return;

            action = gh.Keyboard.keyAssignments[e.keyCode];
            if (action !== undefined && action[0] in gh.Keyboard.state)
                gh.Keyboard.state[action[0]] = 0;
        }, false);

        gh.Keyboard.keyAssignments[38]  = ["moveForward", 1];
        gh.Keyboard.keyAssignments[40]  = ["moveForward", -1];
        gh.Keyboard.keyAssignments[37]  = ["rotate", -1];
        gh.Keyboard.keyAssignments[39]  = ["rotate", 1];
        gh.Keyboard.keyAssignments[192] = ["debug", 1];

        gh.Keyboard.initialized = true;
    },
};

//TODO: Implement touch for phones
gh.Touch = {
    initialized: false,
    state: {
        "moveForward": 0,
        "rotate": 0,
        "strafe": 0,
        "debug": 0
    }
};

gh.Input = function(avatar, devices)
{
    this.avatar = avatar;
    this.devices = (devices instanceof Array) ? devices : [devices];
    this.state = {};
};

gh.Input.prototype.PollDevices = function()
{
    for (var i=0; i < this.devices.length; i++)
        for (var action in this.devices[i].state)
            this.state[action] = this.devices[i].state[action];
};

gh.Input.prototype.UpdateAvatar = function()
{
    //TODO: Check for strafe
    //TODO: Implement rotation speed on actors
    if (this.state.moveForward !== 0)
        this.avatar.Move(this.state.moveForward, 0);
    if (this.state.rotate !== 0)
        this.avatar.Rotate(-this.state.rotate / 26);
};
