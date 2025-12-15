export const VIEWPORT = {
    bWidth: 1200,
    bHeight: 500,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
};

export const WIDTH_ARRAY = [
    1200, // 0: all
    400,  // 1: age 20-40
    400,  // 2: age 50-60
    400,  // 3: age 70
    400,  // 4: area 1-2
    400,  // 5: area 3
    400,  // 6: area 4
    600,  // 7: male
    600   // 8: female
];

// Calculate layout dimensions based on VIEWPORT
const width = VIEWPORT.bWidth - VIEWPORT.margin.left - VIEWPORT.margin.right;
const height = VIEWPORT.bHeight - VIEWPORT.margin.top - VIEWPORT.margin.bottom;

export const DIMENSIONS = {
    width: width,
    height: height,
    aspect: VIEWPORT.bWidth / VIEWPORT.bHeight
};

export const TRANS_WIDTH = [
    width / 2,
    WIDTH_ARRAY[1] / 2,
    WIDTH_ARRAY[2] / 2,
    WIDTH_ARRAY[3] / 2,
    WIDTH_ARRAY[4] / 2,
    WIDTH_ARRAY[5] / 2,
    WIDTH_ARRAY[6] / 2,
    WIDTH_ARRAY[7] / 2,
    WIDTH_ARRAY[8] / 2
];

export const TRANS_HEIGHT = [
    height / 2,
    height / 2,
    height / 2,
    height / 2,
    height / 2,
    height / 2,
    height / 2,
    height / 2,
    height / 2
];
