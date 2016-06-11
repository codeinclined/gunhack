/*
 * Gunhack
 * A procedurally generated FPS using raycasting
 *
 * actor.js
 *
 * Provides the constructor and prototype for actor objects.
 * Actors represent all dynamic objects within the game.
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

gh.Actor = function(x, y, angle, collisionTest, width, speed)
{
    //TODO: Add parameter checking
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.width = width;
    this.speed = (speed !== undefined) ? speed : 0;
    // Values above 0 will make the actor behave as a point light
    this.light = 0;
    // Set this to a function if the actor needs to update every tick
    this.tick = undefined;
    // Set this to enable collision detection
    this.collisionTest = collisionTest;
};

gh.Actor.prototype.FindOffsetToActor = function(actor)
{
    var retObject;
    if (!(actor instanceof gh.Actor))
        return null;

    retObject = {
        x: actor.x - this.x,
        y: actor.y - this.y,
    };
    retObject.angle = Math.atan2(retObject.y, retObject.x);

    return retObject;
};

gh.Actor.prototype.Translate = function(x, y)
{
    if (x === undefined || y === undefined)
        return;

    this.x += x;
    this.y += y;
};

gh.Actor.prototype.Rotate = function(angle)
{
    if (angle === undefined)
        return;

    this.angle = gh.NormalizeAngle(this.angle + angle);
};

/**
 * Moves an actor based on its defined speed and orientation
 *
 * @param {number} forwardScale - Multiplier of actor's speed forward
 * @param {number} strafeScale - Multiplier of actor's speed sideways
 * @param {function} collisionTest - Function to use to test for collision
*/
gh.Actor.prototype.Move = function(forwardScale, strafeScale)
{
    var dX, dY;
    var displacementAngle = this.angle;

    if (forwardScale === 0 && strafeScale === 0)
        return;
    forwardScale = gh.ClampValue(forwardScale);
    strafeScale  = gh.ClampValue(strafeScale);

    if (forwardScale > 0)
        displacementAngle = gh.NormalizeAngle(displacementAngle + strafeScale *
            Math.PI / (2 + forwardScale * 2));
    else if (forwardScale < 0)
        displacementAngle = gh.NormalizeAngle(displacementAngle + Math.PI +
            strafeScale * Math.PI / (2 - forwardScale * 2));

    dX = Math.cos(displacementAngle) * this.speed;
    dY = -Math.sin(displacementAngle) * this.speed;

    if (this.collisionTest !== undefined)
    {
        if (this.collisionTest(this.x + dX, this.y, this.width))
            dX = 0;
        if (this.collisionTest(this.x, this.y + dY, this.width))
            dY = 0;
    }

    this.x += dX;
    this.y += dY;
};
