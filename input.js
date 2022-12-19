const {remote} = require("electron");

const ipcRenderer = require('electron').ipcRenderer;

const {BrowserWindow} = require('electron')

// document.addEventListener("keydown", keydown);
// function keydown(event) {
//     //表示键盘监听所触发的事件，同时传递参数event
//     switch (event.keyCode) {
//         case 27: // esc
//             break;
//         default:
//             console.log('yyyyyyyyyyyyyyyyyy');
//             console.log(event.keyCode);
//             break;
//     }
// }

console.log('get_last_data_ask123');
ipcRenderer.send('get_last_data_ask', remote.getCurrentWindow().id);

ipcRenderer.on('ipc2input', function(event, arg) {
    console.log("yyyyyyyyyyyyyyy");
    console.log(arg); // prints "pong"
    document.querySelector("#user_host").value=arg;
});

ipcRenderer.on('get_last_data_reply', function(event, arg) {
    console.log(arg);
    console.log("get_last_data_reply");
    user_host=document.querySelector('#user_host');
    console.log(user_host);
    user_host.value = arg.userhost;
    dir=document.querySelector('#directory');
    dir.value = arg.dir;
    console.log(arg.dir);
    // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
});


// ipcRenderer.on('move2dropdown', function(event, arg) {
//     console.log("move2dropdown");
//     console.log(arg); // prints "pong"
//     // document.querySelector("#user_host").value=arg;
// });


document.addEventListener("keydown", keydown);

function keydown(event) {
    //表示键盘监听所触发的事件，同时传递参数event
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    console.log(event.keyCode);
    switch (event.keyCode) {
        case 27: 
            ipcRenderer.send('close_child_win', '');
            break;
        default:
            // console.log(event.keyCode);
            break;
    }
    // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
}


let child;
child_is_on=false;
function openDropdown(obj) {
    console.log("123");
    console.log(obj);
    
    // window.open('dropdown.html', '_blank');
    // const {remote, BrowserWindow} = require('electron');
    // let top = remote.getCurrentWindow();
    // let child = new BrowserWindow({parent: top, modal: true});
    // child.loadURL('https://github.com');
    // console.log(remote.getCurrentWindow().getPosition());
    console.log(remote.getCurrentWindow());
    
    parent_position=remote.getCurrentWindow().getPosition();
    // // remote.getCurrentWindow().get
    console.log("++++++++++++++++++++++++++++++++++++");
    console.log(parent_position);
    console.log("++++++++++++++++++++++++++++++++++++");
    if(child_is_on==false){
        child_is_on=true;
        child = new remote.BrowserWindow({ 
            width: 700, 
            maxWidth: 700,
            minWidth: 700,
            height: 260, 
            maxHeight: 260, 
            minHeight: 260, 
            parent: remote.getCurrentWindow(), 
            // modal: true, 
            frame: false, 
            resizable: false
        });
        ipcRenderer.send('add_child_id', child.id);
        child.on('close_dropdown', () => {
            console.log('close_dropdown');
        })
        // child.webContents.openDevTools();
        child.setPosition(parseInt(parent_position[0]+43), parseInt(parent_position[1]+87), false);
        // child.setPosition(parseInt(parent_position[0]), parseInt(parent_position[1]), false);
        child.loadFile('./dropdown.html');
        
        remote.getCurrentWindow().show();
        // console.log("here1");
        // ipcRenderer.send('get_candidate_data_ask', child.id);
        // console.log(child.id);
        child.on("close", () => {
            ipcRenderer.send('add_child_id', 0); 
            child_is_on=false; 
            child = null;
        });
    }else{
        // console.log(child_is_on);
        // child.close();
    }

}

function updateContent(obj) {
    console.log(obj.value);
    ipcRenderer.send('current_input_value', obj.value);
}
// console.log("xxxxxxxxxxxxxxxxxxxxxxxxxasdxxxxxxxxxxxxxxxxxxx");
// console.log(ipcMain);
// ipcMain.on('dropdown2ipc', function(event, arg) {
//     console.log("xxxxxxxxxxxxxxxxxxx");
//     console.log(arg);  // prints "ping"
//     // child.webContents.send('ipc2input', arg);
// });
