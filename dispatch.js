const fs = require('fs');

(async () => {
    const fetch = (await import('node-fetch')).default;

    const url = 'https://prod-gf-jp.zenlesszonezero.com/query_gateway?version=OSPRODWin1.0.0&rsa_ver=3&language=1&platform=3&seed=195fdb867197c041&channel_id=1&sub_channel_id=0';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Valid, saving to data.json');

            const jsonString = JSON.stringify(data, null, 2);
            fs.writeFile('data/data.json', jsonString, (err) => {
                if (err) throw err;
                console.log('Data saved to data.json');
            });
        })
        .catch(error => {
            console.error('Error fetching or saving the JSON file:', error);
        });
})();
