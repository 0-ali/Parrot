/*!
 Finisheding 1.0 (https://github.com/xc0d3rz/Parrot)
 * Copyright 2016-2017 xc0d3rz(x.c0d3rz000@gmail.com)
 * Licensed under the MIT license
 */

(function () {
    var speechSynthesisSupported = 'speechSynthesis' in window,
        webkitSpeechRecognitionisSupported = 'webkitSpeechRecognition' in window,
        isPaused = false,
        isPlaying = false,
        supportedLangList = [
            ['Afrikaans', ['af-ZA']],
            ['العربية', ['ar-SA']],
            ['Bahasa Indonesia', ['id-ID']],
            ['Bahasa Melayu', ['ms-MY']],
            ['Català', ['ca-ES']],
            ['Čeština', ['cs-CZ']],
            ['Dansk', ['da-DK']],
            ['Deutsch', ['de-DE']],
            ['English', ['en-AU', 'Australia'],
                ['en-CA', 'Canada'],
                ['en-IN', 'India'],
                ['en-NZ', 'New Zealand'],
                ['en-ZA', 'South Africa'],
                ['en-GB', 'United Kingdom'],
                ['en-US', 'United States']],
            ['Español', ['es-AR', 'Argentina'],
                ['es-BO', 'Bolivia'],
                ['es-CL', 'Chile'],
                ['es-CO', 'Colombia'],
                ['es-CR', 'Costa Rica'],
                ['es-EC', 'Ecuador'],
                ['es-SV', 'El Salvador'],
                ['es-ES', 'España'],
                ['es-US', 'Estados Unidos'],
                ['es-GT', 'Guatemala'],
                ['es-HN', 'Honduras'],
                ['es-MX', 'México'],
                ['es-NI', 'Nicaragua'],
                ['es-PA', 'Panamá'],
                ['es-PY', 'Paraguay'],
                ['es-PE', 'Perú'],
                ['es-PR', 'Puerto Rico'],
                ['es-DO', 'República Dominicana'],
                ['es-UY', 'Uruguay'],
                ['es-VE', 'Venezuela']],
            ['Euskara', ['eu-ES']],
            ['Filipino', ['fil-PH']],
            ['Français', ['fr-FR']],
            ['Galego', ['gl-ES']],
            ['Hrvatski', ['hr_HR']],
            ['IsiZulu', ['zu-ZA']],
            ['Íslenska', ['is-IS']],
            ['Italiano', ['it-IT', 'Italia'],
                ['it-CH', 'Svizzera']],
            ['Lietuvių', ['lt-LT']],
            ['Magyar', ['hu-HU']],
            ['Nederlands', ['nl-NL']],
            ['Norsk bokmål', ['nb-NO']],
            ['Polski', ['pl-PL']],
            ['Português', ['pt-BR', 'Brasil'],
                ['pt-PT', 'Portugal']],
            ['Română', ['ro-RO']],
            ['Slovenščina', ['sl-SI']],
            ['Slovenčina', ['sk-SK']],
            ['Suomi', ['fi-FI']],
            ['Svenska', ['sv-SE']],
            ['Tiếng Việt', ['vi-VN']],
            ['Türkçe', ['tr-TR']],
            ['Ελληνικά', ['el-GR']],
            ['български', ['bg-BG']],
            ['Pусский', ['ru-RU']],
            ['Српски', ['sr-RS']],
            ['Українська', ['uk-UA']],
            ['한국어', ['ko-KR']],
            ['中文', ['cmn-Hans-CN', '普通话 (中国大陆)'],
                ['cmn-Hans-HK', '普通话 (香港)'],
                ['cmn-Hant-TW', '中文 (台灣)'],
                ['yue-Hant-HK', '粵語 (香港)']],
            ['日本語', ['ja-JP']],
            ['हिन्दी', ['hi-IN']],
            ['ภาษาไทย', ['th-TH']]],
        supportMessageEle = document.getElementById('support-message'),
        voiceSelect = document.getElementById('voice'),
        langSelect = document.getElementById('language'),
        statusImage = document.getElementById('status'),
        controlButton = document.getElementById('control');
    var eParrot = Parrot;

    /**
     *
     * @param message
     */
    eParrot.prototype.log = function (message) {
        console.log(message);
    };

    /**
     *
     * @param message
     */
    eParrot.prototype.notify = function (type) {
        if (type == 'error') {
            supportMessageEle.classList.add('unSupported');
        } else {
            supportMessageEle.classList.remove('unSupported');
        }
    };

    /**
     *
     * @param text
     * @constructor
     */
    eParrot.prototype.SpeechSynthesis = function (text) {
        var synUtterance = new SpeechSynthesisUtterance(),
            voiceSelected = voiceSelect.options[voiceSelect.selectedIndex];
        synUtterance.text = text;
        if (voiceSelected.value) {
            synUtterance.voice = speechSynthesis
                .getVoices()
                .filter(function (voice) {
                    return voice.name === voiceSelected.value;
                })[0];
        }
        synUtterance.lang = voiceSelected.getAttribute('lang');
        synUtterance.addEventListener('start', function () {
            Typed.new('#support-message', {
                strings: ["<msg>Speaking</msg>", "<pt>...</pt>"],
                typeSpeed: 0,
                loop: true
            });

        });
        synUtterance.addEventListener('end', function () {
            Typed.new('#support-message', {
                strings: ["<msg>Finished</msg>", "<pt>...</pt>"],
                typeSpeed: 0,
                loop: true
            });
            statusImage.src = "/images/paused.svg";

        });
        speechSynthesis.speak(synUtterance);
    };

    /**
     *
     * @param url
     * @param type
     * @param successHandler
     * @param errorHandler
     * @param isJson
     */
    eParrot.prototype.request = function (url, type, successHandler, errorHandler, isJson) {
        var xhr = typeof XMLHttpRequest != 'undefined' ?
            new XMLHttpRequest() :
            new ActiveXObject('Microsoft.XMLHTTP');
        xhr.open(type, url, true);
        xhr.onreadystatechange = function () {
            var status;
            var data;
            if (xhr.readyState == 4) { // `DONE`
                status = xhr.status;
                if (status >= 200 && status < 400) {
                    data = (typeof isJson != "undefined" && isJson == true) ? JSON.parse(xhr.responseText) : xhr.responseType;
                    successHandler && successHandler(data, xhr);
                } else {
                    errorHandler && errorHandler(data, xhr);
                }
            }
        };
        xhr.send();
    };

    /**
     *
     * @param t
     */
    eParrot.prototype.gTranslator = function (t) {
        this.request("http://localhost:3000/g-translator/result?q=" + encodeURIComponent(t) + "&tl=" + encodeURIComponent(voiceSelect.options[voiceSelect.selectedIndex].getAttribute('lang')), 'GET', function (d) {
            eParrot.prototype.SpeechSynthesis(d.res);
        }, function () {
            console.error({msg: "getting translation error!", more: arguments});
        }, true);
    };
    eParrot.prototype.isSupported = function () {
        if (speechSynthesisSupported && webkitSpeechRecognitionisSupported) {
            supportMessageEle.innerHTML = 'Your browser <strong>supports</strong> the speech synthesis and Web Speech API.';
        } else {
            supportMessageEle.innerHTML = 'Your browser <strong>does not support</strong> speech synthesis and Web Speech API.';
            this.notify('error');
        }
    };

    eParrot.prototype.loadOptions = function () {
        var voices = speechSynthesis.getVoices();
        voices.forEach(function (voice) {
            var option = document.createElement('option');
            option.value = voice.name;
            option.setAttribute('lang', voice.lang);
            option.innerHTML = voice.name.replace(/Google/g, '').trim();
            voiceSelect.appendChild(option);
        });
        supportedLangList.forEach(function (lang) {
            var option = document.createElement('option');
            option.value = lang[1][0];
            option.innerHTML = lang[0];
            langSelect.appendChild(option);
        });
    };

    eParrot.prototype.Events = {
        start: function () {
            eParrot.prototype.temp['recognizing'] = true;
            Typed.new('#support-message', {
                strings: ['<msg>Listening</msg>', '<pt>...</pt>'],
                typeSpeed: 0,
                loop: true
            });
            statusImage.src = '/images/mic.svg';
            controlButton.setAttribute('status', 'playing');

        },
        error: function (e) {
            statusImage.src = '/images/mic-muted.svg';
            eParrot.prototype.temp['ignore_onend'] = false;
            eParrot.prototype.notify('error');
            if (e.error == 'no-speech') {
                Typed.new('#support-message', {
                    strings: ['<strong>No speech was detected.</strong> You may need to adjust your <a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892">microphonesettings</a>.'],
                    typeSpeed: 0,
                    loop: true
                });
            }
            if (e.error == 'audio-capture') {
                Typed.new('#support-message', {
                    strings: ['<strong>No microphone was found.</strong> Ensure that a microphone is installed and that <a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892">microphone settings</a> are configured correctly.'],
                    typeSpeed: 0,
                    loop: true
                });
            }
            if (e.error == 'not-allowed') {
                if (e.timeStamp - eParrot.prototype.temp.start_timestamp < 100) {
                    Typed.new('#support-message', {
                        strings: ['<strong>Permission to use microphone is blocked.</strong> To change, go to chrome://settings/contentExceptions#media-stream'],
                        typeSpeed: 0,
                        loop: true
                    });
                } else {
                    Typed.new('#support-message', {
                        strings: ['<strong>Permission to use microphone was denied.</strong>'],
                        typeSpeed: 0,
                        loop: true
                    });
                }


            }

        },
        result: function (e, r) {
            if (typeof e.results == 'undefined') {
                r.stop();
            }
            Typed.new('#support-message', {
                strings: ['<msg>Translating</msg>', '<pt>...</pt>'],
                typeSpeed: 0,
                loop: true
            });
            for (var i = e.resultIndex; i < e.results.length; ++i) {
                if (e.results[i].isFinal) {
                    eParrot.prototype.gTranslator(event.results[i][0].transcript);
                } else {
                    eParrot.prototype.gTranslator(e.results[i][0].transcript);
                }
            }
        },
        end: function () {
            eParrot.prototype.temp['recognizing'] = false;
            statusImage.src = "/images/start.svg";
            Typed.new('#support-message', {
                strings: ["<msg>Processing</msg>", "<pt>...</pt>"],
                typeSpeed: 0,
                loop: true
            });
            controlButton.setAttribute('status', 'paused');
        },
        begin: function (r) {
            r.lang = langSelect.value;
            if (eParrot.prototype.temp.recognizing) {
                r.stop();
            }
            r.start();
        }
    };
}.call(window));