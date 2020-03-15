const WebSocket = require('ws');

const wss = new WebSocket.Server({
    port: 8579
});
const messages = [{ //0 - получен анонс, запускает интервью
        58822: {
            Interview: {
                TS: Date.now().toString(),
                State: 0
            }
        }
    },
    {
        //1 - получено описание устройства
        58822: {
            ieeeAddr: "000D6F001336867C",
            Interview: {
                TS: Date.now().toString(),
                State: 1
            }
        }
    },
    {
        //2 - получено количествы активные эндпоинты
        58822: {
            ieeeAddr: "000D6F001336867C",
            Interview: {
                TS: Date.now().toString(),
                State: 2
            },
            ep: {
                1: {},
                2: {}
            }
        }
    },

    {
        //3 - получены кластеры
        58822: {

            ieeeAddr: "000D6F001336867C",
            Interview: {
                TS: Date.now().toString(),
                State: 3
            },
            ep: {
                1: {
                    profId: 260,
                    In: {
                        0: [{}],
                        1: [{}],
                        3: [{}],
                        4: [{}],
                        9: [{}],
                        1280: [{}],
                        1282: [{}],
                        65530: [{}]
                    },
                    Out: {
                        3: [{}],
                        25: [{}]
                    },
                    devId: 1027
                },
                2: {
                    profId: 260,
                    In: {
                        0: [{}],
                        1: [{}],
                        3: [{}],
                        4: [{}],
                        9: [{}],
                        1280: [{}],
                        1282: [{}],
                        65530: [{}]
                    },
                    Out: {
                        3: [{}],
                        25: [{}]
                    },
                    devId: 1027
                }
            }
        }
    },
    {
        //4- получена модель
        58822: {

            ieeeAddr: "000D6F001336867C",
            Interview: {
                TS: Date.now().toString(),
                State: 4
            },
            st: {
                linkquality: 7,
                trSeqNum: 95,
                voltage: 3.025,
                battery: 100
            },
            ep: {
                1: {
                    profId: 260,
                    In: {
                        0: [{}],
                        1: [{}],
                        3: [{}],
                        4: [{}],
                        9: [{}],
                        1280: [{}],
                        1282: [{}],
                        65530: [{}]
                    },
                    Out: {
                        3: [{}],
                        25: [{}]
                    },
                    devId: 1027
                },
                2: {
                    profId: 260,
                    In: {
                        0: [{}],
                        1: [{}],
                        3: [{}],
                        4: [{}],
                        9: [{}],
                        1280: [{}],
                        1282: [{}],
                        65530: [{}]
                    },
                    Out: {
                        3: [{}],
                        25: [{}]
                    },
                    devId: 1027
                }
            },
            ManufName: "GS",
            ModelId: "SRHMP-I1",
        }
    },

];
let messageNum = 0;
let intervalId = 0;
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        console.log('received: %s', message);
        clearInterval(intervalId);
        ws.send(JSON.stringify(messages[messageNum++]));
        intervalId = setInterval(() => {
            if (messageNum >= messages.length) {
                messageNum = 0;
                clearInterval(intervalId);
            } else {
                ws.send(JSON.stringify(messages[messageNum++]));
            }
        }, 5000);
    });


});