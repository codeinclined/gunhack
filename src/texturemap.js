/*
 * Gunhack
 * A procedurally generated FPS using raycasting
 *
 * texturemap.js
 *
 * Defines the constructor and prototype for texturemap.
 * Each texturemap loads an image and creates an atlas of textures.
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

gh.Texturemap = function(url)
{
    var self = this;

    if (url === undefined)
        return null;

    this.ready = false;
    this.url = url;
    this.elementSize = 0;
    this.atlas = new Image();
    this.atlas.src = url;
    this.atlas.onload = function() {
        self.elementSize = self.atlas.height;
        self.ready = true;
    };
};

gh.Texturemap.prototype.SampleColumn = function(sample, index)
{
    if (!this.ready)
        return null;
    if (index < 0 || index > this.atlas.width / this.elementSize)
        return null;
    if (sample > 1)
        sample = 1;
    else if (sample < 0)
        sample = 0;
    return Math.floor(this.elementSize * index + sample * this.elementSize);
};
