const { ipcRenderer } = require('electron');
const { remote } = require("electron");

var userhost_or_dir = '';
child_move_event_timer = {};

ipcRenderer.on('userhost_or_dir', function (event, u_or_d) {
    console.log('userhost_or_dir dropdown.js');
    console.log(u_or_d);
    userhost_or_dir = u_or_d;
});

ipcRenderer.on('basewin_pos', function (event, pos) {
    if (userhost_or_dir == 'user_host') {
        this_window = remote.getCurrentWindow();
        (function () {
            // 核心在这里，先清除定时器
            clearTimeout(child_move_event_timer);
            child_move_event_timer = setTimeout(function () {
                this_window.setPosition(parseInt(pos[0] + 43), parseInt(pos[1] + 87), false);
                this_window.setContentSize(700, 260, false);
            }, 1);
        })();
    } else if (userhost_or_dir == 'directory') {
        this_window = remote.getCurrentWindow();
        (function () {
            // 核心在这里，先清除定时器
            clearTimeout(child_move_event_timer);
            child_move_event_timer = setTimeout(function () {
                this_window.setPosition(parseInt(pos[0] + 43), parseInt(pos[1] + 132), false);
                this_window.setContentSize(700, 260, false);
            }, 1);
        })();
    } else {
        console.error("userhost_or_dir wrong which is: " + userhost_or_dir);
    }
});

function liclick(obj) {
    // console.log(obj);
    obj.querySelector('span');
    // console.log(obj.querySelector('span'));
    this_window = remote.getCurrentWindow();
    ipcRenderer.send('dropdown_li', obj.querySelector('span').textContent, userhost_or_dir);
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

var dropdown_per = {};
var base_str = '';

ipcRenderer.on('reply_dropdown_per', function (event, d_p) {
    console.log('reply_dropdown_per');
    dropdown_per = d_p;
    console.log(dropdown_per);
    console.log(userhost_or_dir);
    console.log('----------------');
    ipcRenderer.send('ask_input_value', userhost_or_dir);
});

ipcRenderer.on('current_input_value', function (event, arg) {
    console.log('current_input_value');
    if (userhost_or_dir == 'user_host') {
        update_userhost_ul(arg);
    } else if (userhost_or_dir == 'directory') {
        update_dir_ul(arg);
    } else {
        console.error("userhost_or_dir wrong which is: " + userhost_or_dir);
    }
});

function update_userhost_ul(current_input) {
    if (dropdown_per == {}) {
        console.error("dropdown_per is empty!");
        return;
    }
    ul_dropdown = document.querySelector('.dropdown');
    var obj = [];
    for (var i = 0; i < dropdown_per.length; i++) {
        obj.push(dropdown_per[i].userhost);
    }
    text = '';
    ul_dropdown.innerHTML = text;
    if (current_input != '') {
        base_str = current_input;
        obj.sort(compare);
        base_str = '';
    }
    for (var i = 0; i < obj.length; i++) {
        text = text + '<li onclick="liclick(this)"\n';
        text = text + "<div>\n";
        text = text + "<span>" + obj[i] + "\n";
        text = text + "</span>\n";
        text = text + "</div>\n";
        text = text + "<button style=\"float: right; margin-right: 30px;\">删除</button id=\"self_delete\">";
        text = text + "</li>";
    }
    ul_dropdown.innerHTML = text;
    var but = document.querySelectorAll('button');
    for (var i = 0; i < but.length; i++) {
        but[i].onclick = function (event) {
            event.stopPropagation();
            var the_ul = event.target.parentNode.parentNode;
            var userhost_tobe_deleted = event.target.parentNode.querySelector('span').innerText;
            event.target.parentNode.remove(event.target);
            // console.log(the_ul);
            ipcRenderer.send('delete_in_per', userhost_tobe_deleted, 0);
            if (the_ul.querySelectorAll('li').length == 0) {
                this_window = remote.getCurrentWindow();
                this_window.close();
            }
        };
    }
}

function update_dir_ul(current_input) {
    if (dropdown_per == {}) {
        console.error("dropdown_per is empty!");
        return;
    }
    ul_dropdown = document.querySelector('.dropdown');
    var obj = [];
    for (var i = 0; i < dropdown_per.length; i++) {
        for (var j = 0; j < dropdown_per[i].dirs.length; j++) {
            obj.push(dropdown_per[i].dirs[j]);
        }
    }
    text = '';
    ul_dropdown.innerHTML = text;
    if (current_input != '') {
        base_str = current_input;
        obj.sort(compare);
        base_str = '';
    }
    for (var i = 0; i < obj.length; i++) {
        text = text + '<li onclick="liclick(this)"\n';
        text = text + "<div>\n";
        text = text + "<span>" + obj[i] + "\n";
        text = text + "</span>\n";
        text = text + "</div>\n";
        text = text + "<button style=\"float: right; margin-right: 30px;\">删除</button id=\"self_delete\">";
        text = text + "</li>";
    }
    ul_dropdown.innerHTML = text;
    var but = document.querySelectorAll('button');
    for (var i = 0; i < but.length; i++) {
        but[i].onclick = function (event) {
            event.stopPropagation();
            var the_ul = event.target.parentNode.parentNode;
            var userhost_tobe_deleted = event.target.parentNode.querySelector('span').innerText;
            event.target.parentNode.remove(event.target);
            // console.log(the_ul);
            ipcRenderer.send('delete_in_per', dir_tobe_deleted, 1);
            if (the_ul.querySelectorAll('li').length == 0) {
                this_window = remote.getCurrentWindow();
                this_window.close();
            }
        };
    }
}

ipcRenderer.send('dropdown_is_ready');
console.log('dropdown_is_ready');

ipcRenderer.send('ask_dropdown_per', remote.getCurrentWindow().id);