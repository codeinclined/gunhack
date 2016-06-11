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
    this.level    = (level === undefined)    ? 1 : this.level  = level;
    this.width    = (width === undefined)    ? 20 : this.width  = width;
    this.height   = (height === undefined)   ? 20 : this.height = height;
    this.floor    = (floor === undefined)    ? "#5c5452" : this.floor = floor;
    this.ceiling  = (ceiling === undefined)  ? "#937d67" : ceiling;
    this.tilesize = (tilesize === undefined) ? 64 : this.tilesize = tilesize;

    this.worldWidth  = this.tilesize * this.width;
    this.worldHeight = this.tilesize * this.height;

    //TODO: Add logic to load tilemaps based on the level ranges
    this.texturemap = new gh.Texturemap((texturemap === undefined ?
        "/assets/texturemaps/offices.jpg" : texturemap));

    this.tiles = this.generate_tiles();
};

gh.Map.prototype.generate_tiles = function()
{
    var retTiles = [];

    //TODO: Make this do more than make a box of tiles with value 1
    for (var y = 0; y < this.height; y++)
    {
        retTiles[y] = [];
        for (var x = 0; x < this.width; x++)
        {
            if (x === 0 || x == this.width - 1 ||
                y === 0 || y == this.height - 1)
            {
                retTiles[y].push(new gh.Tile(1));
                continue;
            }

            retTiles[y].push(new gh.Tile(0));
        }
    }

    return retTiles;
};

gh.Map.prototype.GetTileFromWorld = function(x, y)
{
    return (this.tiles[Math.floor(y / this.tilesize)]
        [Math.floor(x / this.tilesize)]);
};

gh.Map.prototype.CastRay = function(x, y, angle, maxSteps)
{
    var retObject, step = 0;
    var tileX, tileY;
    var curX, curY, dX, dY, curTile;
    var TANangle, COSangle;

    if (x === undefined || y === undefined || angle === undefined)
        return null;
    if (maxSteps === undefined)
        maxSteps = 32;

    angle = gh.NormalizeAngle(angle);
    if (angle == Math.PI || gh.PIm3d2) // Prevent infinity
        angle += 0.0001;

    TANangle = Math.tan(angle);
    COSangle = Math.cos(angle);

    // Vertical test
    dX = (angle > gh.PId2 && angle < gh.PIm3d2 ?
        -this.tilesize : this.tilesize);
    dY = -dX * TANangle;

    curX = (dX < 0) ? (this.tilesize * Math.floor(x / this.tilesize) - 0.001) :
        (this.tilesize * Math.ceil(x / this.tilesize) + 0.001);
    curY = y - (curX - x) * TANangle;

    for (step = 0; step < maxSteps &&
         curX > 0 && curX < this.worldWidth &&
         curY > 0 && curY < this.worldHeight;
         curX += dX, curY += dY, step++)
    {
        tileX = Math.floor(curX / this.tilesize);
        tileY = Math.floor(curY / this.tilesize);
        curTile = this.tiles[tileY][tileX];

        if (curTile.type > 0)
        {
            retObject = {};
            retObject.wallType = curTile.type;
            retObject.distToOrigin = (curX - x) / COSangle;
            retObject.orientation = (dX < 0) ? 0 : 2;
            retObject.sample = (tileY * this.tilesize +
                this.tilesize - curY) / this.tilesize;
            retObject.x = curX;
            retObject.y = curY;
            break;
        }
    }

    // Horizontal test
    dY = (angle > 0 && angle < Math.PI) ? -this.tilesize : this.tilesize;
    dX = -dY / TANangle;

    curY = (dY < 0 ? (this.tilesize * Math.floor(y / this.tilesize) - 0.001) :
        (this.tilesize * Math.ceil(y / this.tilesize) + 0.001));
    curX = x - (curY - y) / TANangle;

    for (step = 0;  step < maxSteps &&
         curX > 0 && curX < this.worldWidth &&
         curY > 0 && curY < this.worldHeight;
         curX += dX, curY += dY, step++)
    {
        var dto;

        tileX = Math.floor(curX / this.tilesize);
        tileY = Math.floor(curY / this.tilesize);
        curTile = this.tiles[tileY][tileX];

        if (curTile.type > 0)
        {
            dto = (curX - x) / COSangle;
            if (retObject === undefined)
                retObject = {};
            else if (dto > retObject.distToOrigin)
                break;

            retObject.distToOrigin = dto;
            retObject.wallType = curTile.type;
            retObject.orientation = (dX < 0) ? 1 : 3;
            retObject.sample = (tileX * this.tilesize +
                this.tilesize - curX) / this.tilesize;
            retObject.x = curX;
            retObject.y = curY;
            break;
        }
    }

    return (retObject) ? retObject : null;
};

gh.Map.prototype.CheckCollision = function(x, y, width)
{
    var halfWidth;
    if (x === undefined || y === undefined)
        throw "Attempted to check collision on map without coordinates";
    if (width === undefined)
        width = this.tilesize;
    halfWidth = width / 2;

    if (width < this.tilesize)
    {
        //TODO: Find a way to optimize this if no tile boundaries are crossed.
        if (this.GetTileFromWorld(x - halfWidth, y - halfWidth).type > 0)
            return true;
        if (this.GetTileFromWorld(x + halfWidth, y - halfWidth).type > 0)
            return true;
        if (this.GetTileFromWorld(x + halfWidth, y + halfWidth).type > 0)
            return true;
        if (this.GetTileFromWorld(x - halfWidth, y + halfWidth).type > 0)
            return true;
    }
    else
    {
        for (var checkY=y-halfWidth; checkY < y+halfWidth;
            checkY += this.tilesize)
        {
            for (var checkX=x-halfWidth; checkX < x+halfWidth;
                checkX += this.tilesize)
            {
                if (this.GetTileFromWorld(checkX, checkY).type > 0)
                    return true;
            }
        }
    }

    return false;
};
