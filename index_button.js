function launch_vscode(user_host, directory) {
    const exec = require('child_process').exec;
    // 任何你期望执行的cmd命令，ls都可以
    // 执行cmd命令的目录，如果使用cd xx && 上面的命令，这种将会无法正常退出子进程
    cmdStr="code --remote ssh-remote+"+user_host+" "+directory;
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



launch_button = document.querySelector('.button_style');
launch_button.onclick=function(){
    console.log("=================123============");
    input_user_host=document.querySelector("#user_host");
    console.log(input_user_host);
    directory=document.querySelector("#directory");
    console.log(directory);
    // launch_vscode(user_host.value, directory.value);
    // 除了launch之外还保存cookies
    // save_cookies();
    
} 

const session = require("electron").remote.session;

function save_cookie(){
    console.log("=============save_cookie============");
    input_user_host=document.querySelector("#user_host").value;
    // console.log(input_user_host);
    directory=document.querySelector("#directory").value;
    // console.log(directory);
    // launch_vscode(user_host.value, directory.value);

}



// var cmd=require('node-cmd');
 
// cmd.get(
//     'pwd',
//     function(err, data, stderr){
//         console.log('the current working dir is : ',data)
//     }
// );

// cmd.run('touch example.created.file');

// cmd.get(
//     `
//         git clone https://github.com/RIAEvangelist/node-cmd.git
//         cd node-cmd
//         ls
//     `,
//     function(err, data, stderr){
//         if (!err) {
//            console.log('the node-cmd cloned dir contains these files :\n\n',data)
//         } else {
//            console.log('error', err)
//         }

//     }
// );