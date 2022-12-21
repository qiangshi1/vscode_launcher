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
    "dir": "/home/shiqiang/" 
};
store.set('dropdown_per', dropdown_per);
store.set('input_per', input_per);
console.log(store.get('candidate_data'));

dropdown_winid=0; // 下拉菜单（本质上是个进程）id，下拉菜单最多只可能有一个，为0表示不存在下拉菜单

let base_win // 主窗口

function createWindow () {
    base_win = new BrowserWindow({width: 400, height: 180, resizable: false}); // 创建浏览器窗口并设置宽高
    base_win.loadFile('./index.html') // 加载页面
    base_win.webContents.openDevTools() // 打开开发者工具
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
ipcMain.on('update_dropdown_winid', function(event, d_w) {
    dropdown_winid=d_w;
});
// 请求dropdown的持久化资源，携带dropdwon窗口id
ipcMain.on('ask_dropdown_per', function(event, d_w) {
    if(d_w != 0){
        BrowserWindow.fromId(d_w).send('reply_dropdown_per', store.get('dropdown_per'));
    }
});
// 删除持久化中的条目
// type:0表示删除userhost
// type:1表示删除dir
ipcMain.on('delete_in_per', function(event, item, type) {
    switch(type){
        case 0: { // 删除userhost
            var dd_p=store.get('dropdown_per');
            for (var i=0; i < dd_p.length; i++){
                if (dd_p[i].userhost == item){
                    dd_p.splice(i, 1);
                    break;
                }
            }
            store.set('dropdown_per', dd_p);
            break;
        }
        case 1: {
            // 待填充
        }
        default: 
            break;
    }
});
// 请求input持久化数据
ipcMain.on('ask_input_per', function(event, d_w) {
    if(d_w != 0){
        BrowserWindow.fromId(d_w).send('reply_input_per', store.get('input_per'));
    }
});
// input中的字段有更改，向dropdown窗口发送
ipcMain.on('input_value_change', function(event, input_value) {
    if(dropdown_winid != 0){
        BrowserWindow.fromId(dropdown_winid).send('current_input_value', input_value);
    }
});
// input中的字段有更改，向dropdown窗口发送
ipcMain.on('ask_input_value', function(event, ignore) {
        base_win.webContents.send('reply_input_value', ignore);
});
// 关闭dropdown窗口，可以由按esc触发
ipcMain.on('close_dropdown', function(event, arg) {
    if(dropdown_winid != 0){
        BrowserWindow.fromId(dropdown_winid).close();
    }
});
// 用户按下button，保存当前的userhost和dir
ipcMain.on('save_userhost_dir', function(event, userhost, dir) {
    var dd_p = store.get('dropdown_per');
    var found_userhost=false;
    var found_dir=false;
    var index=0;
    // console.log(userhost);
    // console.log(dir);
    for (let i=0; i<dd_p.length; i++){
        // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        // console.log(dd_p[i]);
        // console.log(i);
        // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        if(dd_p[i].userhost==userhost){
            found_userhost=true;
            index=i;
            break;
        }
    }
    if(found_userhost==false){
        // console.log("found_userhost==false");
        var a_new_item={};
        a_new_item.userhost=userhost;
        a_new_item.dirs=[];
        a_new_item.dirs.push(dir);
        dd_p.push(a_new_item);
    }else{
        // console.log("else found_userhost==false");
        var a_exit_item=dd_p[index];
        for(var j=0; j<a_exit_item.dirs.length; j++){
            // console.log(a_exit_item.dirs);
            if(a_exit_item.dirs[j]==dir){
                found_dir=true;
                break;
            }
        }
        if(found_dir==false){ // dir有更新，持久化要更新
            // console.log("found_dir==false");
            a_exit_item.dirs.push(dir);
            // console.log('============================');
            // console.log(dd_p);
            dd_p[index]=a_exit_item;
            // console.log(dd_p);
            // console.log('============================');
        }
    }
    store.set('dropdown_per', dd_p);
    var i_p={};
    i_p.userhost=userhost;
    i_p.dir=dir;
    store.set('input_per', i_p);
    // // 如果存储数据有更新，同时dropdown页面存在，要更新dropdown页面
    // var found_userhost=false;
    // var found_dir=false;
    // console.log('here1');
    // console.log(dropdown_winid);
    // console.log(found_userhost);
    // console.log(found_dir);
    if((found_userhost==false||found_dir==false)&&dropdown_winid != 0){
        // console.log('here2');
        BrowserWindow.fromId(dropdown_winid).send('reply_dropdown_per', store.get('dropdown_per'));
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
