const { exec } = require("child_process");

const executeCommand = command => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            let result = {};
            
            if (stderr) {
               result.stderr = stderr;
            } else {
                result.stderr = '';
            }

            result.stdout = stdout;

            resolve(result);
        });
    })
}