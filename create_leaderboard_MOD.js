module.exports = {

    //---------------------------------------------------------------------
    // Action Name
    //
    // This is the name of the action displayed in the editor.
    //---------------------------------------------------------------------

    name: "Create Leaderboard",

    //---------------------------------------------------------------------
    // Action Section
    //
    // This is the section the action will fall into.
    //---------------------------------------------------------------------

    section: "Lists and Loops",

    //---------------------------------------------------------------------
    // DBM Mods Manager Variables (Optional but nice to have!)
    //
    // These are variables that DBM Mods Manager uses to show information
    // about the mods for people to see in the list.
    //---------------------------------------------------------------------

    // Who made the mod (If not set, defaults to "DBM Mods")
    author: "ACertainCoder",

    // The version of the mod (Defaults to 1.0.0)
    version: "1.9.6", //Added in 1.9.6

    // A short description to show on the mod line for this mod (Must be on a single line)
    short_description: "This mod will sort members / servers by their data",

    // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods
    depends_on_mods: [
        {name:'WrexMODS',path:'aaa_wrexmods_dependencies_MOD.js'}
    ],

    //---------------------------------------------------------------------

    //---------------------------------------------------------------------
    // Action Subtitle
    //
    // This function generates the subtitle displayed next to the name.
    //---------------------------------------------------------------------

    subtitle: function (data) {
        const list = ['Server Members', 'All Bot Users', 'All Bot Servers', 'Temp Variable', 'Server Variable', 'Global Variable'];
        return `${list[parseInt(data.list)]}: Create Leaderboard of "${data.data1}" & "${data.data2}"`;
    },

    //---------------------------------------------------------------------
    // Action Storage Function
    //
    // Stores the relevant variable info for the editor.
    //---------------------------------------------------------------------

    variableStorage: function (data, varType) {
        const type = parseInt(data.storage);
        const storagetype = parseInt(data.storagetype);
        let dataTypes = ['List', 'Text'];
        return ([data.varName2, dataTypes[storagetype]]);
    },

    //---------------------------------------------------------------------
    // Action Fields
    //
    // These are the fields for the action. These fields are customized
    // by creating elements with corresponding IDs in the HTML. These
    // are also the names of the fields stored in the action's JSON data.
    //---------------------------------------------------------------------

    fields: ["list", "varName", "data1", "data2", "reverse", "limit", "skipdata", "storagetype", "content", "storage", "varName2"],

    //---------------------------------------------------------------------
    // Command HTML
    //
    // This function returns a string containing the HTML used for
    // editting actions.
    //
    // The "isEvent" parameter will be true if this action is being used
    // for an event. Due to their nature, events lack certain information,
    // so edit the HTML to reflect this.
    //
    // The "data" parameter stores constants for select elements to use.
    // Each is an array: index 0 for commands, index 1 for events.
    // The names are: sendTargets, members, roles, channels,
    //                messages, servers, variables
    //---------------------------------------------------------------------

    html: function (isEvent, data) {
        return `
    <div style="width: 550px; height: 350px; overflow-y: scroll; overflow-x: hidden;">
        <div>
            <p>
            Made by ${this.author}.
            </p>
        </div><br>
        <div style="float: left; width: 35%;">
            Source List:<br>
            <select id="list" class="round" onchange="glob.onChange(this, 'varNameContainer')">
                <option value="0">Server Members</option>
                <option value="1">All Bot Users</option>
                <option value="2">All Bot Servers</option>
                <option value="3">Temp Variable</option>
                <option value="4">Server Variable</option>
                <option value="5">Global Variable</option>
            </select>
        </div>
        <div id="varNameContainer" style="display: none; float: right; width: 60%;">
            Variable Name:<br>
            <input id="varName" class="round" type="text" list="variableList">
        </div><br><br><br>
        <div style="padding-top: 8px; display: table;">
            <div style="display: table-cell;">
                Data Name:<br>
                <input id="data1" class="round" type="text">
            </div>
            <div style="display: table-cell;">
                Alternative Data Name:<br>
                <input id="data2" class="round" type="text" placeholder="Optional">
            </div>
            <div style="display: table-cell;">
                Reverse:<br>
                <select id="reverse" class="round" style="width: 280%;">
                    <option value="0" selected>No</option>
                    <option value="1">Yes</option>
                </select>
            </div>
        </div><br>
        <div style="padding-top: 8px; display: table;">
            <div style="display: table-cell;">
                Result Limit:<br>
                <input id="limit" class="round" type="text" value="10" placeholder="Optional">
            </div>
            <div style="display: table-cell;">
                Skip Undefined Data:<br>
                <select id="skipdata" class="round">
                    <option value="0" selected>Check No Value</option>
                    <option value="1">Check Data1's Value</option>
                    <option value="2">Check Data2's Value</option>
                    <option value="3">Check Both Values</option>
                </select>
            </div>
            <div style="display: table-cell; padding-left: 18px;">
                Store As:<br>
                <select id="storagetype" class="round" style="width: 260%;">
                    <option value="0" selected>List</option>
                    <option value="1">Text</option>
                </select>
            </div>
        </div><br>
        <div style="float: left; width: 104%; padding-top: 8px;">
            Leaderboard Content:<br>
            <input id="content" class="round" type="text" placeholder="\${position}. \${item} - Level: \${data1} XP: \${data2}" value="\${position}. \${item} - Level: \${data1} XP: \${data2}"><br>
        </div>
        <div style="float: left; width: 35%;  padding-top: 8px;">
            Store In:<br>
            <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer2')">
                ${data.variables[1]}
            </select>
        </div>
        <div id="varNameContainer2" style="float: right; width: 60%; padding-top: 8px;">
            Variable Name:<br>
            <input id="varName2" class="round" type="text"><br>
        </div><br><br><br>
        <div style="float: left; width: 100%; padding-top: 8px;">
            <h3>
                Variables for the Leaderboard Content:
            </h3>
            <p>
                Leaderboard Position: \${position}<br>
                Current Item: \${item}<br>
                Data Value: \${data1}<br>
                Alternative Data Value: \${data2}<br>
            </p>
        </div>
    </div>`
    },

    //---------------------------------------------------------------------
    // Action Editor Init Code
    //
    // When the HTML is first applied to the action editor, this code
    // is also run. This helps add modifications or setup reactionary
    // functions for the DOM elements.
    //---------------------------------------------------------------------

    init: function () {
        const { glob, document } = this;

        glob.onChange = function() {
            var varNameContainer = document.getElementById('varNameContainer');
            switch(parseInt(document.getElementById('list').value)) {
                case 0:
                case 1:
                case 2:
                    varNameContainer.style.display = 'none';
                    break;
                case 3:
                case 4:
                case 5:
                    varNameContainer.style.display = null;
                    break;
            }
        }
        glob.variableChange(document.getElementById('storage'), 'varNameContainer3');
    },

    //---------------------------------------------------------------------
    // Action Bot Function
    //
    // This is the function for the action within the Bot's Action class.
    // Keep in mind event calls won't have access to the "msg" parameter,
    // so be sure to provide checks for variable existance.
    //---------------------------------------------------------------------

    action: function (cache) {
        const data = cache.actions[cache.index];
        const AddOns = this.getWrexMods();
        const arraySort = WrexMods.require('array-sort');
        const varName = this.evalMessage(data.varName, cache);
        const data1 = this.evalMessage(data.data1, cache);
        const data2 = this.evalMessage(data.data2, cache);
        const reverse = parseInt(data.reverse) == 1 ? false : true;
        const limit = !parseInt(this.evalMessage(data.limit, cache)) ? Number.MAX_VALUE : parseInt(data.limit);
        const skipdata = parseInt(data.skipdata);
        const content = data.content;
        var datas;
        var list = [];
        var results = [];
        var result = [];

        if(data1 == '' || data1 == undefined) {
            return console.log(`${this.getErrorString}\nMissing Data Name!`);
        }
        if(skipdata == 2 || skipdata == 3) {
            if(data2 == '' || data2 == undefined) {
                return console.log(`${this.getErrorString}\nMissing Alternative Data Name!`);
            }
        }

        switch(parseInt(data.list)) {
            default:
            case 0:
                datas = this.getList(0, varName, cache);
                break;
            case 1:
                datas = this.getDBM().Bot.bot.users.array();
                break;
            case 2:
                datas = this.getDBM().Bot.bot.guilds.array();
                break;
            case 3:
                datas = this.getList(7, varName, cache);
                break;
            case 4:
                datas = this.getList(8, varName, cache);
                break;
            case 5:
                datas = this.getList(9, varName, cache);
                break;
        }

        try {
            datas[0];
        } catch(e) {
            if(e) return console.log(`${this.getErrorString}\nProvided variable wasn't a list!`);
        }
        if(datas.length > 0) {} else {
            return console.log(`${this.getErrorString}\nProvided list was empty!`);
        }

        for(var loop = 0; loop < datas.length; loop++) {
            var check;
            switch(skipdata) {
                case 1:
                    check = (datas[loop].data(data1, 'nodata1existing') === 'nodata1existing' ? false : true);
                    break;
                case 2:
                    check = (datas[loop].data(data2, 'nodata2existing') === 'nodata2existing' ? false : true);
                    break;
                case 3:
                    check = (datas[loop].data(data1, 'nodata1existing') === 'nodata1existing' || datas[loop].data(data2, 'nodata2existing') === 'nodata2existing' ? false : true);
                    break;
                default:
                    check = true;
            }
            if(check) {
                list.push({'item': (datas[loop].user ? datas[loop].user : datas[loop]), 'data1': datas[loop].data(data1, 0), 'data2': datas[loop].data(data2, 0)});
            }
        }

        if(data2 !== undefined && data2 !== "") {
            if(reverse) {
                results = arraySort(list, ['data1', 'data2'], {'reverse': true});
            } else {
                results = arraySort(list, ['data1', 'data2']);
            }
        } else {
            if(reverse) {
                results = arraySort(list, 'data1', {'reverse': true});
            } else {
                results = arraySort(list, 'data1');
            }
        }

        for(var loop = 0; loop < results.length; loop++) {
            async function insertData(data, res, text, pos, cache, _this) {
                const DBM = _this.getDBM();
                const tempVars = _this.getActionVariable.bind(cache.temp);
                if(cache.server) {
                    const serverVars = _this.getActionVariable.bind(_this.server[cache.server.id]);
                } else {
                    const serverVars = null;
                }
                const globalVars = _this.getActionVariable.bind(_this.global);
                const msg = cache.msg;
                const server = cache.server;
                const client = DBM.Bot.bot;
                const bot = DBM.Bot.bot;
                const me = server ? server.me : null;
                if(msg) {
                    const user = msg.author;
                    const member = msg.member;
                    if(msg.mentions) {
                        const mentionedUser = msg.mentions.users.first() || '';
                        const mentionedChannel = msg.mentions.channels.first() || '';
                    }
                }
                if(server) {
                    const defaultChannel = server.getDefaultChannel() || null;
                }
                
                const position = pos+1;
                const item = data[loop].item;
                const data1 = data[loop].data1;
                const data2 = data[loop].data2;
                var content;
                
                if(text.match(/\$\{.*\}/im)) {
                    try {
                        content = eval('`' + text.replace(/`/g,'\\`').replace(/\${text}/g, '').replace(/\${pos}/g, '${position}').replace(/\${data}/g, '').replace(/\${res}/g, '') + '`');
                    } catch(e) {
                        content = item;
                    }
                    res.push(content);
                } else {
                    res.push(item);
                }
            }

            if(loop < limit) {
                insertData(results, result, content, loop, cache, this);
            } else {
                break;
            }
        }

        if(result !== undefined) {
            const storage = parseInt(data.storage);
            const varName2 = this.evalMessage(data.varName2, cache);
            const storagetype = parseInt(data.storagetype);
            if(storagetype == 1) {
                this.storeValue(result.join('\n'), storage, varName2, cache);
            } else {
                this.storeValue(result, storage, varName2, cache);
            }
        }
        this.callNextAction(cache);
    },

    //---------------------------------------------------------------------
    // Action Bot Mod
    //
    // Upon initialization of the bot, this code is run. Using the bot's
    // DBM namespace, one can add/modify existing functions if necessary.
    // In order to reduce conflictions between mods, be sure to alias
    // functions you wish to overwrite.
    //---------------------------------------------------------------------

    mod: function (DBM) {

    }

}; // End of module