const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const firebase = require('firebase/app');
require('firebase/analytics');
require('firebase/database');

const firebaseConfig = {};
const receivedQueues = {};
const receivedHatSwitches = {};

class Scratch3Realtimedb {
    constructor (runtime) {
        this.runtime = runtime;

        this.initializeFirebaseApp();
    }

    initializeFirebaseApp() {
        this._firebaseApp = undefined;
        this._realtimedb = undefined;
    }

    get firebaseApp () {
        if (this._firebaseApp == undefined)
        {
            this._firebaseApp = firebase.default.initializeApp(firebaseConfig);
            firebase.default.analytics();
        }
        return this._firebaseApp;
    }
    
    get realtimeDb () {
        if (this._realtimedb == undefined)
        {
            this._realtimedb = this.firebaseApp.database();
        }
        return this._realtimedb;
    }
    
    getInfo () {
        return {
            id: 'realtimedb',
            name: 'Realtime Database',
            blocks: [
                {
                    opcode: 'setApiKey',
                    blockType: BlockType.COMMAND,
                    text: '【設定1】apiKey は [TEXT] を使う',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "Firebase SDK snippetから貼り付けてね"
                        }
                    }
                },
                {
                    opcode: 'setAuthDomain',
                    blockType: BlockType.COMMAND,
                    text: '【設定2】authDomain は [TEXT] を使う',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "Firebase SDK snippetから貼り付けてね"
                        }
                    }
                },
                {
                    opcode: 'setDatabaseURL',
                    blockType: BlockType.COMMAND,
                    text: '【設定3】databaseURL は [TEXT] を使う',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "Firebase SDK snippetから貼り付けてね"
                        }
                    }
                },
                {
                    opcode: 'setProjectId',
                    blockType: BlockType.COMMAND,
                    text: '【設定4】projectId は [TEXT] を使う',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "Firebase SDK snippetから貼り付けてね"
                        }
                    }
                },
                {
                    opcode: 'setStorageBucket',
                    blockType: BlockType.COMMAND,
                    text: '【設定5】storageBucket は [TEXT] を使う',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "Firebase SDK snippetから貼り付けてね"
                        }
                    }
                },
                {
                    opcode: 'setMessagingSenderId',
                    blockType: BlockType.COMMAND,
                    text: '【設定6】messagingSenderId は [TEXT] を使う',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "Firebase SDK snippetから貼り付けてね"
                        }
                    }
                },
                {
                    opcode: 'setAppId',
                    blockType: BlockType.COMMAND,
                    text: '【設定7】appId は [TEXT] を使う',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "Firebase SDK snippetから貼り付けてね"
                        }
                    }
                },
                {
                    opcode: 'setMeasurementId',
                    blockType: BlockType.COMMAND,
                    text: '【設定8】measurementId は [TEXT] を使う',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "Firebase SDK snippetから貼り付けてね"
                        }
                    }
                },
                {
                    opcode: 'concatPath',
                    blockType: BlockType.REPORTER,
                    text: '[PATH1]/[PATH2]',
                    arguments: {
                        PATH1: {
                            type: ArgumentType.STRING,
                            defaultValue: "データの親階層名"
                        },
                        PATH2: {
                            type: ArgumentType.STRING,
                            defaultValue: "データの子階層名"
                        }
                    }
                },
                {
                    opcode: 'setText',
                    blockType: BlockType.COMMAND,
                    text: '[PATH] の [VALUENAME] に [TEXT] をセット',
                    arguments: {
                        PATH: {
                            type: ArgumentType.STRING,
                            defaultValue: "データパス"
                        },
                        VALUENAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "データ項目名"
                        },
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "データ値"
                        }
                    }
                },
                {
                    opcode: 'listen',
                    blockType: BlockType.COMMAND,
                    text: '[PATH] のデータの受け取りを始める',
                    arguments: {
                        PATH: {
                            type: ArgumentType.STRING,
                            defaultValue: "データパス"
                        }
                    }
                },
                {
                    opcode: 'whenReceive',
                    blockType: BlockType.HAT,
                    text: '[PATH] のデータを受け取った時',
                    arguments: {
                        PATH: {
                            type: ArgumentType.STRING,
                            defaultValue: "データパス"
                        }
                    }
                },
                {
                    opcode: 'receiveText',
                    blockType: BlockType.REPORTER,
                    text: '[PATH] の [VALUENAME] の文字',
                    arguments: {
                        PATH: {
                            type: ArgumentType.STRING,
                            defaultValue: "データパス"
                        },
                        VALUENAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "データ項目名"
                        }
                    }
                },
                {
                    opcode: 'listenChildAdd',
                    blockType: BlockType.COMMAND,
                    text: '[PATH] に追加された子階層名の受け取りを始める',
                    arguments: {
                        PATH: {
                            type: ArgumentType.STRING,
                            defaultValue: "データパス"
                        }
                    }
                },
                {
                    opcode: 'receiveChildKey',
                    blockType: BlockType.REPORTER,
                    text: '[PATH] に追加されたデータの子階層名',
                    arguments: {
                        PATH: {
                            type: ArgumentType.STRING,
                            defaultValue: "データパス"
                        }
                    }
                }
            ],
            menus: {
            }
        };
    }

    setApiKey(args)
    {
        firebaseConfig.apiKey = Cast.toString(args.TEXT);
    }

    setAuthDomain(args)
    {
        firebaseConfig.authDomain = Cast.toString(args.TEXT);
    }
    
    setDatabaseURL(args)
    {
        firebaseConfig.databaseURL = Cast.toString(args.TEXT);
    }
    
    setProjectId(args)
    {
        firebaseConfig.projectId = Cast.toString(args.TEXT);
    }
    
    setStorageBucket(args)
    {
        firebaseConfig.storageBucket = Cast.toString(args.TEXT);
    }
    
    setMessagingSenderId(args)
    {
        firebaseConfig.messagingSenderId = Cast.toString(args.TEXT);
    }
    
    setAppId(args)
    {
        firebaseConfig.appId = Cast.toString(args.TEXT);
    }
    
    setMeasurementId(args)
    {
        firebaseConfig.measurementId = Cast.toString(args.TEXT);
    }

    concatPath(args) {
        const path1 = Cast.toString(args.PATH1);
        const path2 = Cast.toString(args.PATH2);
        return path1 + "/" + path2;
    }

    setText(args) {
        const path = Scratch3Realtimedb.parsePathInput(args.PATH);
        const valueName = Cast.toString(args.VALUENAME);
        const text = Cast.toString(args.TEXT);

        var data = {};
        data[valueName] = text;
        this.realtimeDb.ref(path).set(data);
    }

    listen(args) {
        const path = Scratch3Realtimedb.parsePathInput(args.PATH);

        receivedQueues[path] = [];
        this.realtimeDb.ref(path).on('value', (snapshot) => {
            receivedQueues[path].push(snapshot.val());
        });
    }

    listenChildAdd(args) {
        const path = Scratch3Realtimedb.parsePathInput(args.PATH);

        receivedQueues[path] = [];
        this.realtimeDb.ref(path).on('child_added', (child) => {
            receivedQueues[path].push(child.key);
        });
    }

    whenReceive(args) {
        const path = Scratch3Realtimedb.parsePathInput(args.PATH);
        // after returned true, must return false once.
        if (receivedHatSwitches[path] == true) {
            receivedHatSwitches[path] = false;
            return false;
        }
        if (receivedQueues[path] == undefined) {
            return false;
        }
        if (receivedQueues[path].length == 0) {
            return false;
        }
        receivedHatSwitches[path] = true;
        return true;
    }

    receiveText(args) {
        const path = Scratch3Realtimedb.parsePathInput(args.PATH);
        const valuePath = Cast.toString(args.VALUENAME);
        if (receivedQueues[path] == undefined) {
            return "";
        }
        var data = receivedQueues[path].shift();
        if (data == undefined) {
            return "";
        }
        if (data[valuePath] == undefined)
        {
            return "";
        }
        return Cast.toString(data[valuePath]);
    }

    receiveChildKey(args) {
        const path = Scratch3Realtimedb.parsePathInput(args.PATH);
        if (receivedQueues[path] == undefined) {
            return "";
        }
        var key = receivedQueues[path].shift();
        if (key == undefined) {
            return "";
        }
        return Cast.toString(key);
    }

    static parsePathInput(pathInputArg) {
        return Cast.toString(pathInputArg);
    }
}

module.exports = Scratch3Realtimedb;