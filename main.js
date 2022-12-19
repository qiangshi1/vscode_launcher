const {app, BrowserWindow} = require('electron')  // 基础资源
const Store = require('electron-store');  // 持久化资源
const store = new Store();
const Menu = require('electron').Menu;  // 菜单资源，仅用于阻止菜单
const ipcMain = require('electron').ipcMain;  // ipc资源

// 测试持久化 1
var dropdown_per = [
    {
        "userhost": "shiqiang@172.16.12.144",
        "dirs": [
            "/home/shiqiang",
            "/home/shiqiang1"
        ]
    },
    {
        "userhost": "shiqiang2@172.16.12.144",
        "dirs": [
            "/home/shiqiang2",
            "/home/shiqiang3"
        ]
    },
    {
        "userhost": "hgw@172.16.12.144",
        "dirs": [
            "/home/hgw2",
            "/home/hgw/yes"
        ]
    }
    // {
    //     "userhost": "shiqiang@172.16.12.133",
    //     "dirs": [
    //         "/home/shiqiang",
    //         "/home/shiqiang2"
    //     ]
    // }
];

// 测试持久化 2
input_per={
    "userhost": "shiqiang@172.16.12.144",
    "dir": "home/shiqiang/" 
};
// store.set('dropdown_per', dropdown_per);
// store.set('input_per', input_per);
console.log(store.get('candidate_data'));

dropdown_winid=0; // 下拉菜单（本质上是个进程）id，下拉菜单最多只可能有一个，为0表示不存在下拉菜单

let base_win // 主窗口

function createWindow () {
    base_win = new BrowserWindow({width: 400, height: 180, resizable: false}); // 创建浏览器窗口并设置宽高
    base_win.loadFile('./index.html') // 加载页面
    // base_win.webContents.openDevTools() // 打开开发者工具
    base_win.on('closed', () => { // 添加window关闭触发事件
        base_win = null  // 取消引用
    })
    base_win.on('move', () => {  // 主窗口移动
        win_position=base_win.getPosition();
        if(dropdown_winid != 0){ // 如果下拉菜单存在
            // 向下拉菜单发送主窗口位置，实现功能是下拉菜单跟随主窗口移动
            BrowserWindow.fromId(dropdown_winid).send('basewin_pos', win_position); 
        }
    })
    Menu.setApplicationMenu(null);  // 组织默认菜单
}
// 下拉菜单发送过来的被选中的条目
ipcMain.on('dropdown_userhost_li', function(event, userhost) {
    base_win.webContents.send('input_userhost', userhost); // 用于在basewin的input中显示
});
// 更新dropdown窗口id
ipcMain.on('update_dropdown_winid', function(event, d_wi) {
    dropdown_winid=d_wi;
});
// 请求dropdown的持久化资源，携带dropdwon窗口id
ipcMain.on('ask_dropdown_per', function(event, d_wi) {
    if(d_wi != 0){
        setTimeout(function() { // 防抖
            BrowserWindow.fromId(d_wi).send('reply_dropdown_per', store.get('dropdown_per'));
        }, 10);
    }
});

ipcMain.on('delete_userhost', function(event, userhost_to_be_deleted) {
    console.log("delete_userhost");
    console.log(userhost_to_be_deleted);
    setTimeout(function() {
        console.log("====================================");
        console.log();
        var cds=store.get('candidate_data');
        for (var i=0; i < cds.length; i++){
            if (cds[i].userhost == userhost_to_be_deleted){
                // delete cds[i];
                // cds.remove(i);
                cds.splice(i, 1);
                break;
            }
        }
        console.log(cds);
        store.set('candidate_data', cds);
        console.log("====================================");
    });
});

ipcMain.on('get_last_data_ask', function(event, id) {
    console.log("get_last_data_ask");
    console.log(id);
    if(id != 0){
        setTimeout(function() {
            console.log("====================================");
            console.log(store.get('last_data'));
            console.log("====================================");
            BrowserWindow.fromId(id).send('get_last_data_reply', store.get('last_data'));
        }, 10);
    }
});


ipcMain.on('current_input_value', function(event, arg) {
    if (BrowserWindow.getAllWindows().length == 2){
        console.log('current_input_value111');
        console.log(arg);
        console.log('current_input_value222');
        BrowserWindow.getAllWindows()[1].send('current_input_value2', arg);
    }
});

ipcMain.on('close_child_win', function(event, arg) {
    console.log('close_child_win');
    if (BrowserWindow.getAllWindows().length == 2){
        BrowserWindow.getAllWindows()[1].close();
    }
});


// 初始化后 调用函数
app.on('ready', createWindow)  
// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
   // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
   // 否则绝大部分应用及其菜单栏会保持激活。
   if (process.platform !== 'darwin') {
        app.quit()
   }
})
  
app.on('activate', () => {
// 在macOS上，当单击dock图标并且没有其他窗口打开时，
// 通常在应用程序中重新创建一个窗口。
    if (base_win === null) {
      createWindow();
    }
})
