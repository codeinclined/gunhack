/*
 * Gunhack
 * A procedurally generated FPS using raycasting
 *
 * util.js
 *
 * Provides utility functions for math, angles, etc.
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

gh.PIm2 = Math.PI * 2;
gh.PId2 = Math.PI / 2;
gh.PIm3d2 = 3 * gh.PId2;
gh.PId3 = Math.PI / 3;

gh.NormalizeAngle = function(angle)
{
    while (angle < 0)
        angle += gh.PIm2;
    while (angle > gh.PIm2)
        angle -= gh.PIm2;

    return angle;
};

//TODO: Add support for passing null to min or max to make one-sided clamps
gh.ClampValue = function(value, min, max)
{
    if (min === undefined)
        min = -1;
    if (max === undefined)
        max = 1;
    if (value > max)
        return max;
    if (value < min)
        return min;
    return value;
};

gh.Cardinal = {
    "ALL": -1,
    "E":    0,
    "N":    1,
    "W":    2,
    "S":    3,
    "NE":   4,
    "NW":   5,
    "SW":   6,
    "SE":   7
};
