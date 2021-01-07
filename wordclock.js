const LAYOUTS = {
    "de_DE": "ESKISTAFÜNFZEHNZWANZIGDREIVIERTELVORFUNKNACHHALBAELFÜNFEINSMTXZWEIDREIAUJVIERSECHSNLACHTSIEBENZWÖLFZEHNEUNKUHR",
    "en_EN": "ITKISGHALFETENYQUARTERDTWENTYFIVETOPASTEFOURFIVETWONINETHREETWELVEBELEVENONESSEVENWEIGHTITENSIXTIESTINEO'CLOCK"
}

function layout(lang) {
    if (lang in LAYOUTS)
        return LAYOUTS[lang]
    return LAYOUTS["de_DE"]
}

function letters(h, m, lang) {
    let result = Array(110).fill(0)

    // hours: ZWÖLF, EINS, ZWEI, DREI, ..., ELF
    const hour_regions = [[94, 98], [55, 58], [62, 65], [66, 69], [73, 76], [51, 54], [77, 81], [88, 93], [84, 87], [102, 105], [99, 102], [49, 51]]

    // words
    const word_regions = [[0, 1], // ES
                          [3, 5], // IST
                          [7, 10], // FÜNF
                          [11, 14], // ZEHN
                          [26, 32], // VIERTEL
                          [15, 21], // ZWANZIG
                          [33, 35], // VOR
                          [40, 43], // NACH
                          [44, 47], // HALB
                          hour_regions[h % 12], // current hour
                          hour_regions[(h + 1) % 12], // next hour
                          [55, 57], // EIN
                          [107, 109]] // UHR

    // which word regions to show for which minute (in 5 min steps)
    const logic = {
        "0": [0, 1, 9, 12],
        "5": [0, 1, 2, 7, 9],
        "10": [0, 1, 3, 7, 9],
        "15": [0, 1, 4, 7, 9],
        "20": [0, 1, 5, 7, 9],
        "25": [0, 1, 2, 6, 8, 10],
        "30": [0, 1, 8, 10],
        "35": [0, 1, 2, 7, 8, 10],
        "40": [0, 1, 5, 6, 10],
        "45": [0, 1, 4, 6, 10],
        "50": [0, 1, 3, 6, 10],
        "55": [0, 1, 2, 6, 10],
        "60": [0, 1, 11, 12] // edgecase at 1 o'clock: ES IST EIN UHR
    }

    // round down to next multiple of five
    let logic_minute = Math.floor(m / 5) * 5

    // check for edge cases
    if ((logic_minute + h * 60) in logic)
        logic_minute = logic_minute + h * 60

    logic[logic_minute].forEach(function (word) {
        for (var i = word_regions[word][0]; i <= word_regions[word][1]; i++)
            result[i] = 1
    })
    return result
}

function corners(m) {
    // corners show minutes
    let result = Array(4).fill(0)
    for (var i = 0; i < 4; i++)
        result[i] = i < (m % 5) ? 1 : 0
    return result
}
