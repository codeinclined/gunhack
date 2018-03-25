# Gunhack
A simple, procedurally generated 2.5D game using the rendering techniques
of 90's era raycasting engines like Wolfenstein 3D. All rendering is done
in software via an 2D HTML5 canvas and JavaScript (no WebGL).

![Gunhack Screenshot](/assets/screenshot.JPG)

## Getting Started
To try out a demo of Gunhack, simply navigate to the following link:

http://jupiternebula.com/gunhack-master/

## Building

### Dependencies
Gunhack uses Node.js and Gulp to concatenate, lint, and minify its source
files. With Node.js installed and npm added to the user's path, the following
will commands will install all of the needed depndencies and build the
minified and non-minified gunhack.js files within the "dist/" subdirectory:

    npm install -g gulp
    npm install
    gulp make-dist

### Including in a Web Page
Adding the following HTML tags to your page will allow gunhack.js to create
a new game, receive user input, and render to an HTML5 canvas:

    <canvas id="gunhackCanvas" width="860" height="630"></canvas>
    <script src="dist/gunhack.js"></script>

### Debugging Information
The following is an example of how debugging information from Gunhack can
be rendered to HTML input elements:

    <div class="debug">
        <label>True FPS</label>
        <input type="text" disabled="true" id="inpTrueFPS" /><br />

        <label>Projected FPS</label>
        <input type="text" disabled="true" id="inpProjFPS" /><br />

        <label>Walls Texture Map</label>
        <input type="text" disabled="true" id="inpWallTexturemap" /><br />

        <label>Map Data</label>
        <textarea rows="21" cols="80" id="taMapData" disabled="true"></textarea><br />
    </div>

## Changelog
- 3.24.18 Joshua Taylor - Added README.md and "assets/screenshot.JPG"
- 6.25.16 Joshua Taylor - Added minimap rendering and initial procedural generation code
- 6.11.16 Joshua Taylor - Added double buffering, wall shading, performance debugger, and fullscreen support
- 6.10.16 Joshua Taylor - Fixed rendering code to prevent ray casting misses
- 6.4.16 Joshua Taylor - Rendering code bug squashing
- 5.30.16 Joshua Taylor - Initial commit