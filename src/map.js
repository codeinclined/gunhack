/*
 * Gunhack
 * A procedurally generated FPS using raycasting
 *
 * map.js
 *
 * Provides the
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

gh.Map = function(level, texturemap, floor, ceiling, width, height, tilesize)
{
    var self = this;
    var ready = false;

    this.level    = (level === undefined)    ? 1 : this.level  = level;
    this.width    = (width === undefined)    ? 20 : this.width  = width;
    this.height   = (height === undefined)   ? 20 : this.height = height;
    this.floor    = (floor === undefined)    ? "#5c5452" : this.floor = floor;
    this.ceiling  = (ceiling === undefined)  ? "#937d67" : ceiling;
    this.tilesize = (tilesize === undefined) ? 64 : this.tilesize = tilesize;

    //TODO: Add logic to load tilemaps based on the level ranges
    this.texturemap = new gh.Texturemap((texturemap === undefined ?
        "/assets/texturemaps/offices.jpg" : texturemap));

    this.tiles = this.generate_tiles();
}

gh.Map.prototype.generate_tiles = function()
{
    var retTiles = [];

    //TODO: Make this do more than make a box of tiles with value 1
    for (var y = 0; y < this.height; y++)
    {
        retTiles[y] = [];
        for (var x = 0; x < this.width; x++)
        {
            if (x == 0 || x == this.width - 1 || y == 0 || y == this.height - 1)
            {
                retTiles[y].push(new gh.Tile(1));
                continue;
            }

            retTiles[y].push(new gh.Tile(0));
        }
    }

    return retTiles;
}

gh.Map.prototype.ConvertWorldToTile = function(x, y)
{
    if (x > this.width  * this.tilesize || x < 0 ||
        y > this.height * this.tilesize || y < 0)
        return null;

    var retArray = [Math.floor(x / this.tilesize), Math.floor(y / this.tilesize)];
    return retArray;
}

gh.Map.prototype.CastRay = function(x, y, angle)
{
    var TANangle, COSangle, curX, curY, dX, dY;
    var retObject = {};

    if (x === undefined || y === undefined || angle === undefined)
        return null;

    angle = gh.NormalizeAngle(angle);
    if (angle == Math.PI || angle == gh.PIm3d2)
        angle += 0.0001;

    TANangle = Math.tan(angle);
    COSangle = Math.cos(angle);

    /******************
    ** Vertical Test **
    ******************/
    dX = (angle > gh.PId2 && angle < gh.PIm3d2) ?
        -this.tilesize : this.tilesize;
    dY = dX * TANangle;

    // Initial point
    curX = ((dX < 0) ? -.001 : .001) + this.tilesize * ((dX < 0) ?
        Math.floor(x / this.tilesize) : Math.ceil(x / this.tilesize));
    curY = y - (curX - x) * TANangle;

    for (; curX > 0 && curX < this.width * this.tilesize + 0 &&
           curY > 0 && curY < this.height * this.tilesize + 0;
         curX += dX, curY += dY)
    {
        var curTile = this.ConvertWorldToTile(curX, curY);
        if (this.tiles[curTile[1]][curTile[0]].type > 0)
        {
            retObject.tileType = this.tiles[curTile[1]][curTile[0]].type ;
            retObject.distToOrigin = (curX - x) / COSangle;
            retObject.orientation = (dX < 0) ? 0 : 2;
            retObject.sample = (curTile[1] * this.tilesize + this.tilesize -
                curY) / this.tilesize;
            break;
        }
    }

    /*********************
    ** Horizontal Test **
    *********************/

    dY = (angle > 0 && angle < Math.PI) ? -this.tilesize : this.tilesize;
    dX = -dY / TANangle;

    // Initial point
    curY = ((dY < 0) ? -.001 : .001) + this.tilesize * ((dY < 0) ?
        Math.floor(y / this.tilesize) : Math.ceil(y / this.tilesize));
    curX = x - (curY - y) / TANangle;

    for (; curX > 0 && curX < this.width * this.tilesize &&
           curY > 0 && curY < this.height * this.tilesize;
         curX += dX, curY += dY)
    {
        var curTile = this.ConvertWorldToTile(curX, curY);
        console.log("dX {}", dX);
        if (this.tiles[curTile[1]][curTile[0]].type > 0)
        {
            var dto = (curX - x) / COSangle;

            if (retObject.distToOrigin > dto)
            {
                retObject.tileType = this.tiles[curTile[1]][curTile[0]].type;
                retObject.distToOrigin = dto;
                retObject.orientation = (dY < 0) ? 3 : 1;
                retObject.sample = (curTile[0] * this.tilesize + this.tilesize -
                    curX) / this.tilesize;
            }
            break;
        }
    }

    //console.log(retObject);

    return retObject;
}
