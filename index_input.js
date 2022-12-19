const { remote } = require("electron");
const ipcRenderer = require('electron').ipcRenderer;

// 更新input中的值，可以由下拉菜单出发
ipcRenderer.on('input_userhost', function (event, arg) {
    document.querySelector("#user_host").value = arg;
});
// 请求持久化数据
ipcRenderer.send('ask_input_per', remote.getCurrentWindow().id);
// 获取input持久化数据，
ipcRenderer.on('reply_input_per', function (event, arg) {
    user_host = document.querySelector('#user_host');
    user_host.value = arg.userhost;
    dir = document.querySelector('#directory');
    dir.value = arg.dir;
});
// 监听键盘按下esc
document.addEventListener("keydown", esc_keydown);
function esc_keydown(event) {
    switch (event.keyCode) {
        case 27: // esc
            ipcRenderer.send('close_dropdown', '');
            break;
        default:
            break;
    }
}

dropdown_per_timer = {}; // 下拉菜单定时器，判断是否启动下拉菜单，依据是1：是否已有一个下拉菜单了，2下拉菜单的持久化资源是否没有
has_dropdown_win = false;

let dropdown; // 下拉菜单窗口（进程）句柄
function openDropdown(obj) {  // input被选中
    ipcRenderer.send('ask_dropdown_per', remote.getCurrentWindow().id); // 查询是否有dropdown持久化数据
    if(has_dropdown_win == false){
        clearTimeout(dropdown_per_timer); // 防抖
        dropdown_per_timer = setTimeout(function () {
            basewin_pos = remote.getCurrentWindow().getPosition();
            dropdown = new remote.BrowserWindow({
                width: 700,
                height: 260,
                parent: remote.getCurrentWindow(),
                frame: false,
                resizable: false
            });
            ipcRenderer.send('update_dropdown_winid', dropdown.id);
            dropdown.on('close_dropdown', () => {
                console.log('close_dropdown');
            })
            // dropdown.webContents.openDevTools();
            dropdown.setPosition(parseInt(basewin_pos[0] + 43), parseInt(basewin_pos[1] + 87), false);
            dropdown.loadFile('./dropdown.html');
            remote.getCurrentWindow().show();  // 保持basewin获取焦点
            dropdown.on("close", () => {
                ipcRenderer.send('update_dropdown_winid', 0);
                has_dropdown_win = false;
                dropdown = null;
            });
            has_dropdown_win=true;
        }, 15);
    }
}
// 
ipcRenderer.on('reply_dropdown_per', function (event, dd_p) {
    console.log('reply_dropdown_per');
    console.log(dd_p);
    // alert("bb");
    if (dd_p.length==0){
        // alert("aa");
        console.log('dd_p==[]');
        if(dropdown_per_timer!=null){
            clearTimeout(dropdown_per_timer);
            has_dropdown_win=false;
        }else if(dropdown!=null){
            dropdown.close();
        }
    }
});



function updateContent(obj) {
    console.log(obj.value);
    ipcRenderer.send('input_value_change', obj.value);
}
// console.log("xxxxxxxxxxxxxxxxxxxxxxxxxasdxxxxxxxxxxxxxxxxxxx");
// console.log(ipcMain);
// ipcMain.on('dropdown_userhost_li', function(event, arg) {
//     console.log("xxxxxxxxxxxxxxxxxxx");
//     console.log(arg);  // prints "ping"
//     // dropdown.webContents.send('input_userhost', arg);
// });
