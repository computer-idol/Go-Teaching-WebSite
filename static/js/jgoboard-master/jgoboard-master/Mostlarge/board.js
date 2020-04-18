let path = "http://localhost:8088/static/js/jgoboard-master/jgoboard-master/";
let Mostlarge = {
    textures: {
        black: path+'large/black.png',
        white: path+'large/white.png',
        //shadow:path+'large/shadow.png',
        board: path+'large/shinkaya.jpg'
    },

    // Margins around the board, both on normal edges and clipped ones
    margin: {normal: 30, clipped: 30,color:"#fdbd42"},

    // Shadow color, blur and offset
    //boardShadow: {color: '#ffe0a8', blur: 30, offX: 5, offY: 5},

    // Lighter border around the board makes it more photorealistic
    border: {color: 'rgba(255, 255, 255, 0.3)', lineWidth: 2},

    // Amount of "extra wood" around the grid where stones lie
    padding: {normal: 20, clipped: 10},

    // Grid color and size, line widths
    grid: {color: '#202020', x:90, y: 90, smooth: 0.0,
        borderWidth: 1.5, lineWidth: 1.2},

    // Star point radius
    stars: {radius: 3},

    // Coordinate color and font
    coordinates: {color: '#808080', font: 'normal 18px sanf-serif'},

    // Stone radius  and alpha for semi-transparent stones
    stone: {radius: 20, dimAlpha:0.6},

    // Shadow offset from center
    shadow: {xOff: -2, yOff: 2},

    // Mark base size and line width, color and font settings
    mark: {lineWidth: 1.5, blackColor: 'white', whiteColor: 'black',
        clearColor: 'black', font: 'normal 24px sanf-serif'}
};

export default {
   Mostlarge
}
