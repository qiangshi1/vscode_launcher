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
        case 37:
            alert("左键");
            break;
        case 39:
            alert("右键");
            break;
        case 27: // esc
            this_window = remote.getCurrentWindow();
            this_window.close();
            break;
        default:
            console.log(event.keyCode);
            break;
    }
}

var candidate_data;



ipcRenderer.on('reply_dropdown_per', function (event, cd) {
    candidate_data=cd;
    console.log('reply_dropdown_per');
    console.log(cd);
    // console.log(cd);
    update_ul('');
    // console.log(text);
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
});

function similarity2(s, t) {
    var l = s.length > t.length ? s.length : t.length;
    var d = strSimilarity2Number(s, t);
    return (1 - d / l).toFixed(4);
}

function strSimilarity2Number(s, t) {
    var n = s.length,
        m = t.length,
        d = [];
    var i, j, s_i, t_j, cost;
    if (n == 0) return m;
    if (m == 0) return n;
    for (i = 0; i <= n; i++) {
        d[i] = [];
        d[i][0] = i;
    }
    for (j = 0; j <= m; j++) {
        d[0][j] = j;
    }
    for (i = 1; i <= n; i++) {
        s_i = s.charAt(i - 1);
        for (j = 1; j <= m; j++) {
            t_j = t.charAt(j - 1);
            if (s_i == t_j) {
                cost = 0;
            } else {
                cost = 1;
            }
            d[i][j] = Minimum(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        }
    }
    return d[n][m];
}

function Minimum(a, b, c) {
    return a < b ? (a < c ? a : c) : (b < c ? b : c);
}


console.log(similarity2('456', '123'));
console.log(similarity2('456', '654'));

function compare(v1, v2){
    // console.log(v1);
    // console.log(v2);
    // console.log(base_str);
    d1=similarity2(v1, base_str);
    d2=similarity2(v2, base_str);
    if(d1<d2){
        return 1;
    }else if(d1>d2){
        return -1;
    }else{
        return 0;
    }
}

// strs = ['123', '456', '12', '789'];
var base_str='';

function update_ul(current_input){
    console.log(candidate_data);
    ul_dropdown = document.querySelector('.dropdown');
    var obj=[];
    for (var i = 0; i < candidate_data.length; i++) {
        obj.push(candidate_data[i].userhost);
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
}

ipcRenderer.on('current_input_value', function (event, arg) {
    // console.log('current_input_value-1');
    // console.log(arg);
    // console.log(event);
    // console.log('current_input_value-2');
    update_ul(arg);
});
