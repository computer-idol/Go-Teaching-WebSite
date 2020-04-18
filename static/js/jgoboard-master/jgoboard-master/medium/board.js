// Import or create JGO namespace
let path = "http://localhost:8088/static/js/jgoboard-master/jgoboard-master/";
let medium = {
    textures: {
        black: path+'medium/black.png',
        white: path+'medium/white.png',
        //shadow:path+'/medium/shadow.png',
        board: path+'/medium/shinkaya.jpg'
    },

    // Margins around the board, both on normal edges and clipped ones
    margin: {normal: 20, clipped: 20,color:"#fdbd42"},

    // Shadow color, blur and offset
    //boardShadow: {color: '#ffe0a8', blur: 15, offX: 2.5, offY: 2.5},

    // Lighter border around the board makes it more photorealistic
    border: {color: 'rgba(255, 255, 255, 0.3)', lineWidth: 2},

    // Amount of "extra wood" around the grid where stones lie
    padding: {normal: 15, clipped: 5},

    // Grid color and size, line widths
    grid: {color: '#202020', x: 25, y: 25, smooth: 0,
        borderWidth: 1.2, lineWidth: 0.9},

    // Star point radius
    stars: {radius: 2.5},

    // Coordinate color and font
    coordinates: {color: '#808080', font: 'normal 12px sanf-serif'},

    // Stone radius  and alpha for semi-transparent stones
    stone: {radius: 12, dimAlpha:0.6},

    // Shadow offset from center
    shadow: {xOff: -1, yOff: 1},

    // Mark base size and line width, color and font settings
    mark: {lineWidth: 1.0, blackColor: 'white', whiteColor: 'black',
        clearColor: 'black', font: 'normal 12px sanf-serif'}
};

export default {
  medium
}
