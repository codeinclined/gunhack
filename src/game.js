/*
 * Gunhack
 * A procedurally generated FPS using raycasting
 *
 * game.js
 *
 * This defines the game object which stores information about the player,
 * enemies, etc.
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

gh.Game = function(canvas, maxFPS)
{
    //TODO: Fill in appropriate beginning; this is just a hack to test
    this._boundGameLoop = this.GameLoop.bind(this);
    this.map = new gh.Map(1, undefined, undefined, undefined, 40, 40);
    this.player = new gh.Actor(520, 520, gh.PIm3d2,
        this.CollisionTest.bind(this), 64.1, 36);
    this.renderer = new gh.Renderer(canvas, gh.PId3);
    this.frameInterval = 1000 / (maxFPS !== undefined ? maxFPS : 60);
    this.dTime = 0;
    this.lastFrameTime = 0;

    this.debugger = new gh.Debugger(1.5);
    this.projFPSWatch = this.debugger.AddWatch(
        document.getElementById("inpProjFPS"));

    gh.Keyboard.Initialize();
    this.input = new gh.Input(this.player, gh.Keyboard);
};

gh.Game.prototype.CollisionTest = function(x, y, width)
{
    var retValue = false;
    retValue = this.map.CheckCollision(x, y, width);
    return retValue;
};

gh.Game.prototype.GameLoop = function()
{
    requestAnimationFrame(this._boundGameLoop);

    var curTime = Date.now();
    this.dTime = curTime - this.lastFrameTime;

    if (this.dTime > this.frameInterval)
    {
        this.input.PollDevices();
        this.input.UpdateAvatar();
        this.renderer.RenderFrame(this);

        this.lastFrameTime = curTime - (this.dTime % this.frameInterval);

        //TODO: Add check for debug mode
        this.projFPSWatch.values.push(1000 / (Date.now() - curTime));
        this.debugger.Update(curTime);
    }

    return;
};
