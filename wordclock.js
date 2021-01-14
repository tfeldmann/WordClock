const LAYOUTS = Object.freeze({
    "de_DE": {
        letters: "ESKISTAFÜNFZEHNZWANZIGDREIVIERTELVORFUNKNACHHALBAELFÜNFEINSMTXZWEIDREIAUJVIERSECHSNLACHTSIEBENZWÖLFZEHNEUNKUHR",
        // hours: ZWÖLF, EINS, ZWEI, DREI, ..., ELF
        hours: [[94, 98], [55, 58], [62, 65], [66, 69], [73, 76], [51, 54], [77, 81], [88, 93], [84, 87], [102, 105], [99, 102], [49, 51]],
        words: [
            [0, 1],      // ES
            [3, 5],      // IST
            [7, 10],     // FÜNF
            [11, 14],    // ZEHN
            [26, 32],    // VIERTEL
            [15, 21],    // ZWANZIG
            [33, 35],    // VOR
            [40, 43],    // NACH
            [44, 47],    // HALB
            [55, 57],    // EIN
            [107, 109],  // UHR
        ],
        logic: {
            "0": { words: [0, 1, 10], hour: 0 },
            "5": { words: [0, 1, 2, 7], hour: 0 },
            "10": { words: [0, 1, 3, 7], hour: 0 },
            "15": { words: [0, 1, 4, 7], hour: 0 },
            "20": { words: [0, 1, 5, 7], hour: 0 },
            "25": { words: [0, 1, 2, 6, 8], hour: 1 },
            "30": { words: [0, 1, 8], hour: 1 },
            "35": { words: [0, 1, 2, 7, 8], hour: 1 },
            "40": { words: [0, 1, 5, 6], hour: 1 },
            "45": { words: [0, 1, 4, 6], hour: 1 },
            "50": { words: [0, 1, 3, 6], hour: 1 },
            "55": { words: [0, 1, 2, 6], hour: 1 },
            // edgecase at 1:00 / 13:00 "ES IST EIN UHR"
            "60": { words: [0, 1, 9, 10], hour: null },
        },
    },
    "en_US": {
        letters: "ITKISGHALFETENYQUARTERDTWENTYFIVETOPASTEFOURFIVETWONINETHREETWELVEBELEVENONESSEVENWEIGHTITENSIXTIESTINEO'CLOCK",
        // hours: ZWÖLF, EINS, ZWEI, DREI, ..., ELF
        hours: [[94, 98], [55, 58], [62, 65], [66, 69], [73, 76], [51, 54], [77, 81], [88, 93], [84, 87], [102, 105], [99, 102], [49, 51]],
        words: [
            [0, 1],      // IT
            [3, 4],      // IS
            [6, 9],      // HALF
            [11, 13],    // TEN
            [15, 21],    // QUARTER
            [23, 28],    // TWENTY
            [29, 32],    // FIVE
            [33, 34],    // TO
            [35, 38],    // PAST
            [103, 109],  // O'CLOCK
        ],
        logic: {
            "0": { words: [0, 1, 9], hour: 0 },
            "5": { words: [0, 1, 6, 8], hour: 0 },
            "10": { words: [0, 1, 3, 8], hour: 0 },
            "15": { words: [0, 1, 4, 8], hour: 0 },
            "20": { words: [0, 1, 5, 8], hour: 0 },
            "25": { words: [0, 1, 5, 6, 8], hour: 0 },
            "30": { words: [0, 1, 2, 8], hour: 0 },
            "35": { words: [0, 1, 5, 6, 7], hour: 1 },
            "40": { words: [0, 1, 5, 7], hour: 1 },
            "45": { words: [0, 1, 4, 7], hour: 1 },
            "50": { words: [0, 1, 3, 7], hour: 1 },
            "55": { words: [0, 1, 6, 7], hour: 1 },
        },
    },
});

function find_layout(lang) {
    if (lang in LAYOUTS)
        return LAYOUTS[lang]
    return LAYOUTS["de_DE"]
}

function letters(h, m, lang) {
    let result = Array(110).fill(0)
    let layout = find_layout(lang);

    function light_up(from, to) {
        for (var i = from; i <= to; i++)
            result[i] = 1
    }

    // minute of day rounded to the previous five minutes
    let logic_minute = h * 60 + Math.floor(m / 5) * 5

    // remove the hours if no edge case given
    if (!(logic_minute in layout.logic))
        logic_minute %= 60;

    // light up words
    layout.logic[logic_minute].words.forEach(function (word) {
        light_up(...layout.words[word])
    })
    // light up hour
    if (layout.logic[logic_minute] != null)
        light_up(...layout.hours[(h + layout.logic[logic_minute].hour) % 12]);

    return result
}

function corners(m) {
    // corners show minutes
    let result = Array(4).fill(0)
    for (var i = 0; i < 4; i++)
        result[i] = i < (m % 5) ? 1 : 0
    return result
}
