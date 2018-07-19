const child_process = require('child_process')

function execute(command, callback) {
    child_process.exec(command, function (error, stdout, stderr) {
        callback(stdout, stderr);
    });
};

// Double quotes are used so that the space in the path is not interpreted as multiple arguments
// \\$HOME to use local variable HOME
execute('streamlink.exe twitch.tv/aypierre best', function (stdout, stderr) {
    if (stderr)
        console.error(stderr);
    else
        console.log(stdout)
})