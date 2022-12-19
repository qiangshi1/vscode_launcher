function launch_vscode(user_host, dir) {
    // console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhh');
    const exec = require('child_process').exec;
    // 任何你期望执行的cmd命令，ls都可以
    // 执行cmd命令的目录，如果使用cd xx && 上面的命令，这种将会无法正常退出子进程
    cmdStr="code --remote ssh-remote+"+user_host+" "+dir;
    let workerProcess;
    var arr = [];

    let iconv = require('iconv-lite');
    // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
    workerProcess = exec(cmdStr, {encoding:'GBK'});
    // workerProcess = exec("ipconfig", { encoding:'GBK'});
    // 打印正常的后台可执行程序输出
    workerProcess.stdout.on('data', function (data) {
        arr.push(data);
        // console.log(data);
    });
    // 打印错误的后台可执行程序输出
    workerProcess.stderr.on('data', function (data) {
        // console.log('stderr: ' + data);
    });
    // 退出之后的输出
    workerProcess.on('close', function (code) {
        console.log(iconv.decode(Buffer.concat(arr), 'GBK'));
        // console.log('out code: ' + code);
    });
    
}

function saveUserhostDir(userhost, dir){ 
    ipcRenderer.send('save_userhost_dir', userhost, dir);
}

launch_button = document.querySelector('.button_style');
launch_button.onclick=function(){
    userhost=document.querySelector("#user_host").value;
    dir=document.querySelector("#directory").value;
    // launch_vscode(userhost, dir);
    saveUserhostDir(userhost, dir);
} 