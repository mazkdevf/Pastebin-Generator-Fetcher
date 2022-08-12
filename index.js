const fetch = require("node-fetch");
const cheerio = require("cheerio");
const moment = require("moment");
const fs = require('fs');
var colors = require('colors');
colors.enable()

function RANDUM() {
    const list = "ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz123456789";
    var res = "";
    for(var i = 0; i < 8; i++) {
        var rnd = Math.floor(Math.random() * list.length);
        res = res + list.charAt(rnd);
    }
    return res;
}


async function getPasteBin(rand) {
    const res = await fetch(`https://pastebin.com/${rand}`, {
        'headers': {
            'accept': '*/*',
            'content-type': 'charset=UTF-8',
            'cookie': '',
        },
    });

    const $ = cheerio.load(await res.text());

    var paste = "";
    if (/\s/.test($("[class='notice -no-margin']").text())) {
        paste = $("[class='notice -no-margin']").text().replace(/^\s+|\s+$/gm,'')
    }

    if (paste === "This page is no longer available. It has either expired, been removed by its creator, or removed by one of the Pastebin staff.") {
        console.log(JSON.stringify({ success: false, pasteId: rand, message: "Pastebin Page doens't exist.", date: moment().format("MM dd, YYYY HH:mm:ss") }).red);
        return false;
    }

    var content = "";
    if ($("textarea -raw js-paste-raw").text()) {
        content = $("textarea -raw js-paste-raw").text();
        try {
            await fs.writeFileSync(`./Hits/${moment().format("MM.dd.yyyy-HH-mm-ss")}-hit.txt`, content);
        } catch (err) {
            console.error(err.red);
        }
          

    }

    const text = await JSON.stringify({ success: true, pasteId: rand, content: content });
    return text;
}

(async () => {
    for (var i = 0; i < 9999999999; i++) {
        const rand = RANDUM();
        const text = await getPasteBin(rand);
        if (text) {
            console.log(text.green);
        }
    }
})()