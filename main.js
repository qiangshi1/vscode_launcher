const Store = require('electron-store');
const store = new Store();

const {app, BrowserWindow} = require('electron')
// const {remote} = require('electron')
const Menu = require('electron').Menu;

const ipcMain = require('electron').ipcMain;
// const store = new (require('electron-store'))
// const sessionCookieStoreKey = 'cookies.mainWindow'

// const windows = [];


var userhost_and_dir = [
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

last_data={
    "userhost": "shiqiang@172.16.12.144",
    "dir": "home/shiqiang/" 
};

// store.set('candidate_data', userhost_and_dir);
// store.set('last_data', last_data);
console.log(store.get('candidate_data'));

child_id=0;

// 创建全局变量并在下面引用，避免被GC
let win
function createWindow () {
    // 创建浏览器窗口并设置宽高
    win = new BrowserWindow({width: 400, height: 180, resizable: false})
    
    // 加载页面
    win.loadFile('./index.html')
    
    // 打开开发者工具
    win.webContents.openDevTools()
    
    // 添加window关闭触发事件
    
    win.on('closed', () => {
        win = null  // 取消引用
    })

    win.on('move', () => {
        win_position=win.getPosition();
        // console.log('movemovemove');
        // console.log(win.childrens);
        // win.childrens
        
        win_position=win.getPosition();
        // console.log(win.id);
        // console.log(BrowserWindow.getAllWindows());
        // win.
        // child = BrowserWindow.fromId(2);
        // console.log(child);
        if(child_id != 0){
            BrowserWindow.fromId(child_id).send('move2dropdown', win_position);
        }
        // ipcRenderer.send('move2dropdown', win_position);

        // win.webContents.send('move2dropdown', win_position);
    })
    // windows.push(win);
    Menu.setApplicationMenu(null);


    // let child = new BrowserWindow({parent: win, modal: true});
    // child.loadURL('https://github.com');

    // childWin = new BrowserWindow({
    //     parent: win, 
    //     width: 400, 
    //     height: 300,
    //     module: true
    // });
     
    // childWin.loadFile('dropdown.html');
    // let promise = new Promise((resolve) => {
    //     let cookies = store.get(sessionCookieStoreKey) || [];
    //     let recoverTimes = cookies.length;
    //     if (recoverTimes <= 0) {
    //         //无cookie数据无需恢复现场
    //         resolve()
    //         return;
    //     }
    //     //恢复cookie现场
    //     cookies.forEach((cookiesItem) => {
    //         let {
    //             secure = false,
    //             domain = '',
    //             path = ''
    //         } = cookiesItem

    //         win.webContents.session.cookies
    //             .set(
    //                 Object.assign(cookiesItem, {
    //                     url: (secure ? 'https://' : 'http://') + domain.replace(/^\./, '') + path
    //                 })
    //             )
    //             .then(() => {
    //             })
    //             .catch((e) => {
    //                 console.error({
    //                     message: '恢复cookie失败',
    //                     cookie: cookiesItem,
    //                     errorMessage: e.message,
    //                 })
    //             })
    //             .finally(() => {
    //                 recoverTimes--;
    //                 if (recoverTimes <= 0) {
    //                     resolve();
    //                 }
    //             })
    //     });
    // })
    // promise.then(() => {
    //     //监听cookie变化保存cookie现场
    //     return new Promise((resolve) => {
    //         let isCookiesChanged = false;
    //         win.webContents.session.cookies.on('changed', () => {
    //             //检测cookies变动事件，标记cookies发生变化
    //             isCookiesChanged = true;
    //         });

    //         //每隔500毫秒检查是否有cookie变动，有变动则进行持久化
    //         setInterval(() => {
    //             if (!isCookiesChanged) {
    //                 return;
    //             }
    //             win.webContents.session.cookies.get({})
    //                 .then((cookies) => {
    //                     store.set(sessionCookieStoreKey, cookies);
    //                 })
    //                 .catch((error) => {
    //                     console.log({error})
    //                 })
    //                 .finally(() => {
    //                     isCookiesChanged = false;
    //                 })
    //         }, 500);

    //         resolve();
    //     })
    // })

}
ipcMain.on('dropdown2ipc', function(event, arg) {
    console.log("xxxxxxxxxxxxxxxxxxx");
    console.log(arg);  
    win.webContents.send('ipc2input', arg);
});

ipcMain.on('drag', function(event, arg) {
    console.log("drag-xxxx");
    // console.log(arg);  
    console.log(win);
    // win.webContents.send('ipc2input', arg);
});

ipcMain.on('move2dropdown', function(event, arg) {
    console.log("move2dropdown");
    console.log(arg); // prints "pong"
    // document.querySelector("#user_host").value=arg;
});

ipcMain.on('add_child_id', function(event, arg) {
    console.log("add_child_id");
    child_id=arg;
});

// ipcMain.on('set_store', function(event, arg) {
//     console.log("set_store");
//     // store.set('store', 123);
// });

ipcMain.on('get_candidate_data_ask', function(event, id) {
    console.log("get_candidate_data_ask");
    console.log(id);
    if(id != 0){
        // BrowserWindow.fromId(id).send('get_candidate_data_reply', store.get('candidate_data'));
        setTimeout(function() {
            // console.log(store.get('candidate_data'));
            BrowserWindow.fromId(id).send('get_candidate_data_reply', store.get('candidate_data'));
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
    if (win === null) {
      createWindow();
    }
})
