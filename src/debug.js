/*
 * Gunhack
 * A procedurally generated FPS using raycasting
 *
 * debug.js
 *
 * Provides the Debug object containing references to DOM objects
 * used for debugging the game.
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

//TODO: Fix this to where you don't have to have the needed DOM elements
/*
gh.Debug = {
    interval: 500,
    lastDebugTime: 0,
    projFPS: document.getElementById("inpProjFPS"),
    projFPSCounter: 0
};

gh.Debug.
*/

gh.Debugger = function(updatesPerSecond)
{
    this.updateInterval = (updatesPerSecond !== undefined) ?
        1000 / updatesPerSecond : 500;
    this.lastDebugTime = 0;
    this.watches = [];
};

gh.Debugger.prototype.AddWatch = function(domElement)
{
    var watch = {

        values: [],
        element: domElement
    };
    this.watches.push(watch);
    return watch;
};

gh.Debugger.prototype.Update = function(curTime)
{
    if (curTime === undefined)
        curTime = Date.now();

    if (curTime > this.lastDebugTime + this.updateInterval)
    {
        for (var i = 0; i < this.watches.length; i++)
        {
            if (this.watches[i].values.length === 0)
            {
                this.watches[i].element.value = "Unknown";
                continue;
            }

            this.watches[i].element.value = (this.watches[i].values.reduce(
                function(a,b) { return a+b; }) / this.watches[i].values.length)
                .toFixed(2);
            this.watches[i].values.length = 0;
        }

        this.lastDebugTime = curTime;
    }
};
