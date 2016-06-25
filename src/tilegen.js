/*
 * Gunhack
 * A procedurally generated FPS using raycasting
 *
 * tilegen.js
 *
 * Provides the Tilegen object which contains methods for procedurally
 * generating 2D arrays of tiles.
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

gh.Tilegen = {};

gh.Tilegen.Fill = function(tilesInput, x, y, w, h, tileType)
{
    if (!(tilesInput instanceof Array))
        tilesInput = [];
    if (x === undefined || y === undefined ||
        w === undefined || h === undefined)
        throw "Tried to call CreateBasicRoom without dimensions!";
    if (tileType === undefined)
        tileType = 1;

    for (var curY = y; curY < y+h; curY++)
    {
        if (tilesInput[curY] === undefined)
            tilesInput[curY] = [];

        for (var curX = x; curX < x+w; curX++)
        {
             tilesInput[curY].push(new gh.Tile(tileType));
        }
    }
};

gh.Tilegen.CreateBasicRoom = function(tilesInput, x, y, w, h, borderType)
{
    if (!(tilesInput instanceof Array) || tilesInput.length <= 0)
        gh.Tilegen.Fill(tilesInput, 0, 0, w, h, 0);
    if (x === undefined || y === undefined ||
        w === undefined || h === undefined)
        throw "Tried to call CreateBasicRoom without dimensions!";
    if (borderType === undefined)
        borderType = 1;
    /*
    console.log("CBR: ",x,y,w,h);
    console.log(tilesInput);
    */

    for (var curY = y; curY < y+h && curY < tilesInput.length; curY++)
    {
        for (var curX = x; curX < x+w &&
            curX < tilesInput[curY].length; curX++)
        {
            if (curX === x || curX == x+w - 1 ||
                curY === y || curY == y+h - 1)
            {
                tilesInput[curY][curX].type = borderType;
            }
            else
            {
                tilesInput[curY][curX].type = 0;
            }
        }
    }
};

gh.Tilegen.CreateRoomCorridor = function(tilesInput, x, y, wallType,
    orientation, length, width)
{
    var roomLength, roomWidth, corridorWidth, step = 0;
/*
    if (!(tilesInput instanceof Array) || tilesInput.length <= 0)
        gh.Tilegen.Fill(tilesInput, 0, 0, w, h, 0);
*/
    if (x === undefined || y === undefined || orientation === undefined ||
        length === undefined || width === undefined)
        throw "Tried to call CreateRoomCorridor without dimensions!";
    if (wallType === undefined)
        wallType = 1;

    //TODO: Find a better max value for corridorWidth
    corridorWidth = gh.ClampValue(Math.floor(width / 10), 1, 5);
    roomLength = gh.ClampValue(Math.floor(Math.random() * length), 3, length);
    roomWidth  = gh.ClampValue(Math.floor(width / 2 - corridorWidth / 2),
        3, width);
    console.log("corridorWidth: %o", corridorWidth);
    console.log("   roomLength: %o", roomLength);
    console.log("    roomWidth: %o", roomWidth);

    if (orientation == gh.Cardinal.N || orientation == gh.Cardinal.S)
    {
        if (orientation == gh.Cardinal.N)
            roomLength = -roomLength;

        while (step < length && step > -length)
        {
            //DEBUG: Find out why I need +1 on room length
            gh.Tilegen.CreateBasicRoom(tilesInput, x, y + step, roomWidth,
                roomLength+1, wallType);
            gh.Tilegen.CreateBasicRoom(tilesInput,
                x + roomWidth + corridorWidth, y+step,
                roomWidth, roomLength+1, wallType);

            step += roomLength;
            if (step + roomLength >= length || step + roomLength <= -length)
                roomLength = length - step;
        }
    }
};

gh.Tilegen.CreateOffices = function(width, height, difficulty)
{
    var retTiles = [];

    //TEMP: To make jsHint shutup
    difficulty = 1;

    gh.Tilegen.CreateBasicRoom(retTiles, 0, 0, width, height, 1);
    gh.Tilegen.CreateRoomCorridor(retTiles, 10, 5, 2, gh.Cardinal.S,
        25, 25);


    return retTiles;
};
