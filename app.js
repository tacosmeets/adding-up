'use strict';
const fs = require("fs");
const readline = require('readline');

const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs, output:{} });
const preMap = new Map();

rl.on('line', lineString => {
    const colums = lineString.split(",");
    const year = parseInt(colums[0]);
    const pre = colums[1];
    const popu = parseInt(colums[3]);

    if (year === 2010 || year === 2015) {
        let value = preMap.get(pre);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010) {
            value.popu10 = popu;
        }
        if (year === 2015) {
            value.popu15 = popu
        }
        preMap.set(pre, value);
    }
});

rl.on('close', () => {
    for (const [key, value] of preMap) {
        value.change = value.popu15 / value.popu10;
    }
    const rank = Array.from(preMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    })

    const ranking = rank.map(([key, value]) => {
        return (
            key +
            ": " +
            value.popu10 +
            " => " +
            value.popu15 +
            ' 変化率:' + 
            value.change
        );
    });
    console.log(ranking);
})