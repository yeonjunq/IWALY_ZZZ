const fs = require('fs');
const path = require('path');

const jsonFilePath = 'data/decrypted_data.json';
const configFilePath = 'config.json';

function getValueFromJsonFile(filePath, ...keys) {
    try {
        const jsonData = fs.readFileSync(filePath, 'utf8');
        const jsonObject = JSON.parse(jsonData);

        let value = jsonObject;
        for (const key of keys) {
            if (value.hasOwnProperty(key)) {
                value = value[key];
            } else {
                return null;
            }
        }

        return value;
    } catch (error) {
        console.error('Error reading JSON file:', error);
        return null;
    }
}

function readValueFromFile(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8').trim();
            return data;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error reading file:', error);
        return null;
    }
}

function saveValueToFile(filePath, value) {
    try {
        let dataToWrite = JSON.stringify(value, null, 2);
        dataToWrite = dataToWrite.replace(/"/g, '');

        fs.writeFileSync(filePath, dataToWrite, 'utf8');
        console.log(`Value saved to ${filePath}`);
    } catch (error) {
        console.error('Error saving value to file:', error);
    }
}

function checkAndSaveNewValue(filePath, newValue) {
    const oldValue = readValueFromFile(filePath);
    if (oldValue !== newValue) {
        console.log(`Value has changed for ${filePath}: ${oldValue} -> ${newValue}`);
        saveValueToFile(filePath, newValue);
        return true;
    } else {
        console.log(`No change for ${filePath}`);
        return false;
    }
}

function copyFilesToGamePath(gamePath, files) {
    const targetDir = path.join(gamePath, 'ZenlessZoneZero_Data', 'Persistent');
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    for (const file of files) {
        const fileName = path.basename(file);
        const targetPath = path.join(targetDir, fileName);
        fs.copyFileSync(file, targetPath);
        console.log(`Copied ${file} to ${targetPath}`);
    }
}

// Load config with error handling
let config;
try {
    const configData = fs.readFileSync(configFilePath, 'utf8');
    config = JSON.parse(configData);
} catch (error) {
    console.error('Error reading or parsing config.json:', error);
    process.exit(1);
}

const { gamePath, isReplace } = config;

// Define paths and keys
const main = 'cdn_conf_ext';
const first = 'design_data';
const second = 'game_res';
const third = 'silence_data';

const data = 'data_revision';
const audio = 'audio_revision';
const res = 'res_revision';
const silence = 'silence_revision';

const outputFiledata = 'Persistent/data_revision';
const outputFileaudio = 'Persistent/audio_revision';
const outputFileres = 'Persistent/res_revision';
const outputFilesilence = 'Persistent/silence_revision';

// Get revision values
const datarevision = getValueFromJsonFile(jsonFilePath, main, first, data);
const audiorevision = getValueFromJsonFile(jsonFilePath, main, second, audio);
const resrevision = getValueFromJsonFile(jsonFilePath, main, second, res);
const silencerevision = getValueFromJsonFile(jsonFilePath, main, third, silence);

const filesToCopy = [];

// Check and save new values, add to copy list if changed
if (datarevision !== null && checkAndSaveNewValue(outputFiledata, datarevision)) {
    filesToCopy.push(outputFiledata);
}
if (audiorevision !== null && checkAndSaveNewValue(outputFileaudio, audiorevision)) {
    filesToCopy.push(outputFileaudio);
}
if (resrevision !== null && checkAndSaveNewValue(outputFileres, resrevision)) {
    filesToCopy.push(outputFileres);
}
if (silencerevision !== null && checkAndSaveNewValue(outputFilesilence, silencerevision)) {
    filesToCopy.push(outputFilesilence);
}

if (filesToCopy.length > 0) {
    if (isReplace) {
        copyFilesToGamePath(gamePath, filesToCopy);
    } else {
        console.log('Files changed but not replacing due to config setting.');
    }
} else {
    console.log('No changes detected.');
}
