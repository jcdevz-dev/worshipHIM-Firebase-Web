/* eslint-disable array-callback-return */
/* eslint-disable no-redeclare */
/* eslint-disable no-unreachable */
/* eslint-disable no-throw-literal */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-undef */
/* eslint-disable no-fallthrough */
/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
/* eslint-disable no-useless-escape */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-restricted-syntax */
// Transposer function vanilla

// Pass in the objects to merge as arguments.
// For a deep extend, set the first argument to `true`.
export const extend = function () {
    // Variables
    const extended = {};
    let deep = false;
    let i = 0;
    const {length} = arguments;

    // Check if a deep merge
    if (Object.prototype.toString.call(arguments[0]) === "[object Boolean]") {
        deep = arguments[0];
        i++;
    }

    // Merge the object into the extended object
    const merge = function (obj) {
        for (const prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                // If deep merge and property is an object, merge properties
                if (
                    deep &&
                    Object.prototype.toString.call(obj[prop]) === "[object Object]"
                ) {
                    extended[prop] = extend(true, extended[prop], obj[prop]);
                } else {
                    extended[prop] = obj[prop];
                }
            }
        }
    };

    // Loop through each object and conduct a merge
    for (; i < length; i++) {
        const obj = arguments[i];
        merge(obj);
    }

    return extended;
};

// defaults object for keys chordregex
const defaults = {
    // chordRegex: /^[A-G][b\#]?(2|4|5|6|7|9|11|13|6\/9|7\-5|7\-9|7\#5|7\#9|7\+5|7\+9|b5|#5|#9|7b5|7b9|7sus2|7sus4|add2|add4|add9|aug|dim|dim7|m\/maj7|m6|m7|m7b5|m9|m11|m13|maj7|maj9|maj11|maj13|mb5|m|sus|sus2|sus4)*(\/[A-G][b\#]*)*$/,
    // chordReplaceRegex: /([A-G][b\#]?(2|4|5|6|7|9|11|13|6\/9|7\-5|7\-9|7\#5|7\#9|7\+5|7\+9|b5|#5|#9|7b5|7b9|7sus2|7sus4|add2|add4|add9|aug|dim|dim7|m\/maj7|m6|m7|m7b5|m9|m11|m13|maj7|maj9|maj11|maj13|mb5|m|sus|sus2|sus4)*)/g,
    // chordRegex: /^[A-G][b\#]?(2|4|5|6|7|9|11|13|6\/9|7\-5|7\-9|7\#5|7\#9|7\+5|7\+9|b5|#5|#9|7b5|7b9|7sus2|7sus4|add2|add4|add9|aug|dim|dim7|m\/maj7|m6|m7|m7b5|m9|m11|m13|M7|M9|M11|M13|mb5|m|sus|sus2|sus4)*(\/[A-G][b\#]*)*$/,
    // chordReplaceRegex: /([A-G][b\#]?(2|4|5|6|7|9|11|13|6\/9|7\-5|7\-9|7\#5|7\#9|7\+5|7\+9|b5|#5|#9|7b5|7b9|7sus2|7sus4|add2|add4|add9|aug|dim|dim7|m\/maj7|m6|m7|m7b5|m9|m11|m13|maj7|maj9|maj11|maj13|M7|M9|M11|M13|mb5|m|sus|sus2|sus4)*)/g,
    chordRegex: /^[A-G][b\#]?(6\/9|2|4|5|6|7|9|11|13|7\-5|7\-9|7\#5|7\#9|7\+5|7\+9|b5|#5|#9|7b5|7b9|7sus2|7sus4|add2|add4|add9|aug|dim|dim7|m\/maj7|m6|m7|m7b5|m9|m11|m13|M7|M9|M11|M13|mb5|m|sus|sus2|sus4)*(\/[A-G][b\#]*)*$/,
    chordReplaceRegex: /([A-G][b\#]?(6\/9|2|4|5|6|7|9|11|13|[7\-5]|[7\-9]|[7\#5]|[7\#9]|[7\+5]|[7\+9]|b5|#5|#9|7b5|7b9|7sus2|7sus4|add2|add4|add9|aug|dim|dim7|m\/maj7|m6|m7|m7b5|m9|m11|m13|maj7|maj9|maj11|maj13|M7|M9|M11|M13|mb5|m|sus|sus2|sus4)*)/g
};

// main function transpose
export function transpose(options) {
    const opts = extend({}, defaults, options);

    const preEl = document.getElementsByTagName("pre")[0];
    // if (opts[0]) {
    //     console.log("something");
    //     transposeSong(document.getElement, opts[0]);
    //     // Array.from(
    //     //     document.getElementsByClassName("transpose-keys")[0].childNodes
    //     // ).map((chord) => {
    //     //     chord.classList.remove("selected");
    //     // });
    //     // this.classList.add("selected");
    // }
    const keys = [
        { name: "Ab", value: 0, type: "F" },
        { name: "A", value: 1, type: "N" },
        { name: "A#", value: 2, type: "S" },
        { name: "Bb", value: 2, type: "F" },
        { name: "B", value: 3, type: "N" },
        { name: "C", value: 4, type: "N" },
        { name: "C#", value: 5, type: "S" },
        { name: "Db", value: 5, type: "F" },
        { name: "D", value: 6, type: "N" },
        { name: "D#", value: 7, type: "S" },
        { name: "Eb", value: 7, type: "F" },
        { name: "E", value: 8, type: "N" },
        { name: "F", value: 9, type: "N" },
        { name: "F#", value: 10, type: "S" },
        { name: "Gb", value: 10, type: "F" },
        { name: "G", value: 11, type: "N" },
        { name: "G#", value: 0, type: "S" },
    ];

    const getKeyByName = function (name) {
        if (name.charAt(name.length - 1) == "m") {
            name = name.substring(0, name.length - 1);
        }
        for (let i = 0; i < keys.length; i++) {
            if (name == keys[i].name) {
                return keys[i];
            }
        }
    };

    const getChordRoot = function (input) {
        if (input.length > 1 && (input.charAt(1) == "b" || input.charAt(1) == "#"))
            return input.substr(0, 2);
        return input.substr(0, 1);
    };

    const getNewKey = function (oldKey, delta, targetKey) {
        let keyValue = getKeyByName(oldKey).value + delta;

        if (keyValue > 11) {
            keyValue -= 12;
        } else if (keyValue < 0) {
            keyValue += 12;
        }

        let i = 0;
        if (keyValue == 0 ||
            keyValue == 2 ||
            keyValue == 5 ||
            keyValue == 7 ||
            keyValue == 10) {
            // Return the Flat or Sharp Key
            switch (targetKey.name) {
                case "A":
                case "A#":
                case "B":
                case "C":
                case "C#":
                case "D":
                case "D#":
                case "E":
                case "F#":
                case "G":
                case "G#":
                    for (; i < keys.length; i++) {
                        if (keys[i].value == keyValue && keys[i].type == "S") {
                            return keys[i];
                        }
                    }
                default:
                    for (; i < keys.length; i++) {
                        if (keys[i].value == keyValue && keys[i].type == "F") {
                            return keys[i];
                        }
                    }
            }
        } else {
            // Return the Natural Key
            for (; i < keys.length; i++) {
                if (keys[i].value == keyValue) {
                    return keys[i];
                }
            }
        }
    };


    const getDelta = function (oldIndex, newIndex) {
        if (oldIndex > newIndex)
            return 0 - (oldIndex - newIndex);
        if (oldIndex < newIndex)
            return 0 + (newIndex - oldIndex);
        return 0;
    };

    // var transposeSong = function(target, key) {
    let transChord;
    var transposeSong = function (target, key) {
        // console.log(opts);
        const newKey = getKeyByName(key);
        if (currentKey.name == newKey.name) {
            return;
        }

        const delta = getDelta(currentKey.value, newKey.value);
        const whatToChange = document.querySelectorAll(`span.c`);

        // const newArr = Array.from(whatToChange)
        Array.from(whatToChange).forEach(transposeThis);
        // console.log('trans', transChord);
        currentChord = transChord;
        document.getElementById(`whatChord${x}`).innerHTML = "";
        // Raphael.chord(`whatChord${x}`, currentChord, x).element.setSize(230, 250);
        //  for(var i = 0; i <= newArr.length; i++){
        //  }
        function transposeThis(el) {
            transposeChord(el, delta, newKey);
        }

        currentKey = newKey;

        Array.from(
            document.getElementsByClassName("transpose-keys")[0].childNodes
        ).map((chord) => {
            chord.classList.remove("selected");
        });
        Array.from(
            document.getElementsByClassName("transpose-keys")[0].childNodes
        ).map((chord) => {
            // chord.classList.remove("selected");
            // console.log(chord);
            if (chord.innerText == key) {
                chord.classList.add("selected");
            }
        });



    };


    var transposeChord = function (selector, delta, targetKey) {
        const oldChord = selector.innerText;
        const oldChordRoot = getChordRoot(oldChord);
        const newChordRoot = getNewKey(oldChordRoot, delta, targetKey);
        const newChord = newChordRoot.name + oldChord.substr(oldChordRoot.length);
        selector.innerText = newChord;

        // console.log(oldChord, ' = ', currentChord);
        // return 
        // sync with modal to raphael chord chart
        if (oldChord == currentChord) {
            // currentChord = newChord
            transChord = newChord;
            // document.getElementById(`whatChord${x}`).innerHTML = ""
            // Raphael.chord(`whatChord${x}`, currentChord, x).element.setSize(230, 250);
            // console.log('curr: ', currentChord);
            return true;
        }

        // var sib = selector[0].nextSibling;
        const sib = selector.nextSibling;
        if (sib &&
            sib.nodeType == 3 &&
            sib.nodeValue.length > 0 &&
            sib.nodeValue.charAt(0) != "/") {
            const wsLength = getNewWhiteSpaceLength(
                oldChord.length,
                newChord.length,
                sib.nodeValue.length
            );
            sib.nodeValue = makeString(" ", wsLength);
        }
    };

    var getNewWhiteSpaceLength = function (a, b, c) {
        if (a > b)
            return c + (a - b);
        if (a < b)
            return c - (b - a);
        return c;
    };

    var makeString = function (s, repeat) {
        const o = [];
        for (let i = 0; i < repeat; i++)
            o.push(s);
        return o.join("");
    };

    const isChordLine = function (input) {
        const tokens = input.replace(/\s+/, " ").split(" ");
        for (let i = 0; i < tokens.length; i++) {
            if (!tokens[i].trim().length == 0 && !tokens[i].match(opts.chordRegex))
                return false;
        }
        return true;
    };

    //  wrap chords in span or anything
    const wrapChords = function (input) {
        return input.replace(opts.chordReplaceRegex,
            `<span onclick="showChord(event)" class= 'c' >$1</span > `);
        // `<span onclick="console.log(event.target.innerText)" class= 'c' > $1</span > `);
    };
    let startKey = preEl.getAttribute("data-key");
    const eachPre = document.getElementsByTagName("pre");

    // Array.from(eachPre).forEach(thisLyrics);

    thisLyrics(preEl)

    function thisLyrics(el, i) {
        // console.log(startKey, el.innerText)
        if (!startKey || el.innerText.trim(startKey) == "") {
            startKey = opts.key;
        }

        if (!startKey || el.innerText.trim(startKey) == "") {
            throw "Starting key not defined.";
            return this;
        }

        var currentKey = getKeyByName(startKey);

        // Build tranpose links ===========================================
        const keyLinks = [];
        keys.forEach((key, i) => {
            if (currentKey.name == key.name)
                keyLinks.push(`<a href='#' class='selected'>${key.name}</a>`);
            else
                keyLinks.push(`<a href='#'>${key.name}</a>`);
        });

        const keysHtml = document.createElement("div");
        keysHtml.classList.add("transpose-keys");
        keysHtml.innerHTML = keyLinks.join("");
        // preEl.parentElement.insertBefore(keysHtml, preEl);
        Array.from(keysHtml.childNodes).map((chord) => {
            chord.onclick = function (e) {
                e.preventDefault();
                transposeSong(preEl, this.innerText);

                /// ///////////
                // Selector //
                /// ///////////
                /// ///////////
                // Selector //
                /// ///////////
            };
        });

        const output = [];
        const linestext = preEl.innerText;
        const lines = linestext.split(/\r\n|\n/g);
        let line;
        const tmp = "";
        for (var i = 0; i < lines.length; i++) {
            line = lines[i];
            if (isChordLine(line))
                output.push(`<span>${wrapChords(line)}</span>`);
            else
                output.push(`<span>${line}</span>`);
        }
        preEl.innerHTML = output.join("\n");
    }
}