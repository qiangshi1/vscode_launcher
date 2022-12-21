const { ipcRenderer } = require('electron');
const { remote } = require("electron");
// import similarity2 from './edit_distance.js'
// import {sum} from "./edit_distance"

// const ipcMain = require('electron').ipcMain;
// ipcMain.on('drag', function(event, arg) {
//     console.log("xxxxxxxxxxxxxxxxxxx");
// });

child_move_event_timer = {};
ipcRenderer.send('ask_dropdown_per', remote.getCurrentWindow().id);

ipcRenderer.on('basewin_pos', function (event, pos) {
    // console.log("basewin_pos");
    this_window = remote.getCurrentWindow();
    // this_window.setPosition(parseInt(pos[0]+43), parseInt(pos[1]+87), false);
    // this_window.setContentSize(700, 260, false);
    // console.log(this_window.getSize());
    // this_window.setSize(700, 260, true);
    // this_window.setContentSize(700, 260, false);
    // console.log(this_window.getSize());
    // width: 700, height: 260, 

    // console.log(arg); // prints "pong"
    // document.querySelector("#user_host").value=arg;
    
    (function () {
        // 核心在这里，先清除定时器
        clearTimeout(child_move_event_timer);
        child_move_event_timer = setTimeout(function () {
            this_window.setPosition(parseInt(pos[0] + 43), parseInt(pos[1] + 87), false);
            this_window.setContentSize(700, 260, false);
        }, 1);
    })();

});


function liclick(obj) {
    console.log(obj);
    // ipcRenderer.send("close_dropdown");
    obj.querySelector('span');
    console.log(obj.querySelector('span'));
    this_window = remote.getCurrentWindow();
    ipcRenderer.send('dropdown_userhost_li', obj.querySelector('span').textContent);
    // const id = remote.getGlobal('sharedObject').independentWindow.get('窗口名windowTitle');
    // console.log(remote.getGlobal(''));
    // this_window.close();
    
    this_window = remote.getCurrentWindow();
    this_window.close();
}

document.addEventListener("keydown", keydown);

function keydown(event) {
    //表示键盘监听所触发的事件，同时传递参数event
    switch (event.keyCode) {
        case 27: // esc
            this_window = remote.getCurrentWindow();
            this_window.close();
            break;
        default:
            console.log(event.keyCode);
            break;
    }
}

var dropdown_per={};
var base_str='';

ipcRenderer.on('reply_dropdown_per', function (event, d_p) {
    dropdown_per=d_p;
    ipcRenderer.send('ask_input_value');
});

ipcRenderer.on('current_input_value', function (event, arg) {
    update_ul(arg);
});


function update_ul(current_input){
    if(dropdown_per=={}){
        console.error("dropdown_per is empty!");
        return;
    }
    ul_dropdown = document.querySelector('.dropdown');
    var obj=[];
    for (var i = 0; i < dropdown_per.length; i++) {
        obj.push(dropdown_per[i].userhost);
    }
    text = '';
    ul_dropdown.innerHTML = text;
    if(current_input != ''){
        base_str = current_input;
        obj.sort(compare);
        base_str = '';
    }
    for (var i = 0; i < obj.length; i++) {
        // text=text+"<li onclick=\"liclick(this)\"\n";
        text = text + '<li onclick="liclick(this)"\n';
        text = text + "<div>\n";
        text = text + "<span>" + obj[i] + "\n";
        text = text + "</span>\n";
        text = text + "</div>\n";
        text = text + "<button style=\"float: right; margin-right: 30px;\">删除</button id=\"self_delete\">";
        text = text + "</li>";
    }
    ul_dropdown.innerHTML = text;
    var but=document.querySelectorAll('button');
    for(var i=0; i<but.length; i++){
        but[i].onclick=function(event){
            event.stopPropagation();
            var the_ul=event.target.parentNode.parentNode;
            var userhost_tobe_deleted=event.target.parentNode.querySelector('span').innerText;
            // console.log(event.target.parentNode.querySelector('span').innerText);
            event.target.parentNode.remove(event.target);
            // console.log(event.target.parentNode.querySelector('li').length);
            console.log(the_ul);
            ipcRenderer.send('delete_in_per', userhost_tobe_deleted, 0);
            if(the_ul.querySelectorAll('li').length==0){
                this_window = remote.getCurrentWindow();
                this_window.close();
            }
        };
    }
}


