const { exec } = require('child_process');
const path = require('path');

// Paths to the scripts
const dispatchPath = path.join(__dirname, 'dispatch.js');
const decryptPath = path.join(__dirname, 'decrypt.js'); // Ensure this is the correct path
const persistPath = path.join(__dirname, 'persist.js'); // Ensure this is the correct path

// Execute dispatch.js
exec(`node ${dispatchPath}`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error executing dispatch.js: ${error}`);
        return;
    }

    if (stdout) {
        console.log(`Output: ${stdout}`);
        console.log('Received encrypted response. Decrypting now.');

        // Execute decrypt.js
        exec(`node ${decryptPath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing decrypt.js: ${error}`);
                return;
            }

            if (stdout) {
                console.log(`Output: ${stdout}`);
                console.log('Decrypted successfully');
                console.log('Checking if there are new updates');

                // Execute persist.js
                exec(`node ${persistPath}`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error executing persist.js: ${error}`);
                        return;
                    }

                    if (stdout) {
                        console.log(`Output: ${stdout}`);
                    }

                    if (stderr) {
                        console.error(`Error: ${stderr}`);
                    }
                });
            }

            if (stderr) {
                console.error(`Error: ${stderr}`);
            }
        });
    }

    if (stderr) {
        console.error(`Error: ${stderr}`);
    }
});
