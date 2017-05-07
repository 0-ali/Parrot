/*!
 * Parrot.js 1.0 (https://github.com/xc0d3rz/Parrot)
 * Copyright 2016-2017 xc0d3rz(x.c0d3rz000@gmail.com)
 * Licensed under the MIT license
 */

(function () {
    var Parrot = function () {

    };
    Parrot.prototype.SpeechRecognition = function (t) {
        var recognition = new webkitSpeechRecognition(),caller=this;
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.onstart = this.on().start;
        recognition.onerror = this.on().error;
        recognition.onend = this.on().end;
        recognition.onresult = function (e) {
            console.log(e);
            caller.on().result(e, recognition);
        };
        if(t == 1) {
            this.on().begin(recognition);
        }else{
            recognition.stop();
            this.on().end();
        }
    };

    /**
     *
     * @param event
     */
    Parrot.prototype.on = function (event) {
        var deepExtend = function (out) {
            out = out || {};

            for (var i = 1; i < arguments.length; i++) {
                var obj = arguments[i];

                if (!obj)
                    continue;

                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === 'object')
                            out[key] = deepExtend(out[key], obj[key]);
                        else
                            out[key] = obj[key];
                    }
                }
            }

            return out;
        };
        this.Events = deepExtend(this.Events, event);
        return this.Events;
    };

    /**
     *
     * @type {{}}
     */
    Parrot.prototype.Events = {};

    /**
     *
     * @type {{}}
     */
    Parrot.prototype.temp = {};
    window.Parrot = Parrot;
}.call(window));