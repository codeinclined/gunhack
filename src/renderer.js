/*
 * Gunhack
 * A procedurally generated FPS using raycasting
 *
 * renderer.js
 *
 * Defines the constructor and prototype for Renderer.
 * Renderer is in charge of rendering the game.
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

gh.Renderer = function(canvas, fov, drawDistance, fogDepth)
{
    //TODO: Add check for valid canvas
    this.canvas = canvas;
    if (this.canvas.getContext)
        this.ctx = this.canvas.getContext('2d');
    else
        throw "Cannot get a 2D canvas context.";
    this.fov = (fov === undefined ? 60 : fov);
    this.drawDistance = (drawDistance !== undefined ? drawDistance : 2560);
    this.fogDepth = (fogDepth !== undefined ? fogDepth : 560);
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.depthBuffer = [];
};



gh.Renderer.prototype.SetCamera = function(x, y, angle, fov)
{
    if (x !== undefined) this.x = x;
    if (y !== undefined) this.y = y;
    if (angle !== undefined) this.angle = angle;
    if (fov !== undefined) this.fov = fov;
};

gh.Renderer.prototype.RenderMap = function(map)
{
    // Clean up variable locations and initialization
    var startAngle, dAngle, renderHeight, halfRenderHeight, curRay;
    var halfCanvasHeight = this.canvas.height / 2;
    if (!(map instanceof gh.Map))
        throw "RenderMap() passed parameter not derived from gh.Map!";

    startAngle = this.angle + this.fov / 2;
    dAngle = this.fov / this.canvas.width;

    // Texture errors result in pink columns
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "#FF00FF";
    this.ctx.beginPath();

    for (var column = 0; column < this.canvas.width; column++)
    {
        var rayAngle = startAngle - dAngle * column;
        var sampleX;

        curRay = map.CastRay(this.x, this.y, rayAngle);
        if (curRay === null)
            continue;

        this.depthBuffer[column] =
            curRay.distToOrigin * Math.cos(this.angle - rayAngle);
        renderHeight = this.canvas.height * map.tilesize /
            this.depthBuffer[column];
        halfRenderHeight = renderHeight / 2;
        sampleX = map.texturemap.SampleColumn(curRay.sample,curRay.wallType-1);

        // Draw a plain line if an error arises in sampling the texture
        if (sampleX === null)
        {
            this.ctx.moveTo(column + 0.5, 0.5 +
                halfCanvasHeight - halfRenderHeight);
            this.ctx.lineTo(column + 0.5, 0.5 +
                halfCanvasHeight + halfRenderHeight);
        }
        else
        {
            this.ctx.drawImage(map.texturemap.atlas, 0.5 + sampleX, 0, 1,
                map.texturemap.atlas.height, column + 0.5, halfCanvasHeight -
                halfRenderHeight, 1, renderHeight);
        }

        //TODO: Change rendering to draw to a seperate canvas. Double-buffering.

/*
        // Shade the column
        //TODO: Optimize away the divide and profile this!!!
        columnPixels = this.ctx.getImageData(column + 0.5,
            0.5 + halfCanvasHeight - halfRenderHeight, 1, renderHeight);
        for (var pixel = 0; pixel < columnPixels.data.length / 4; pixel++)
        {
            // A
            columnPixels.data[pixel * 4 + 3]
        }
*/
    }

    this.ctx.stroke();
};

gh.Renderer.prototype.RenderBackground = function(ceiling, floor)
{
    //TODO: Pre-calculate half canvas height and width
    this.ctx.fillStyle = ceiling;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height / 2);
    this.ctx.fillStyle = floor;
    this.ctx.fillRect(0, this.canvas.height / 2,
        this.canvas.width, this.canvas.height);
};

gh.Renderer.prototype.RenderFrame = function(game)
{
    this.RenderBackground(game.map.ceiling, game.map.floor);
    this.SetCamera(game.player.x, game.player.y,
        game.player.angle, gh.PId3);
    this.RenderMap(game.map);
};
