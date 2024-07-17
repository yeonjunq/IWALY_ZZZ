const fs = require('fs');
const NodeRSA = require('node-rsa');

// Function to load private key from a .bin file
function loadPrivateKeyFromBinFile(filename) {
    const privateKeyBuffer = fs.readFileSync(filename);
    return new NodeRSA(privateKeyBuffer, { encryptionScheme: 'pkcs1', environment: 'browser' });
}

// Function to decrypt value from JSON using the private key
function decryptValueFromJSON(jsonFilename, keyName, privateKey) {
    // Load and parse JSON file
    const jsonData = JSON.parse(fs.readFileSync(jsonFilename, 'utf8'));

    // Retrieve the encrypted value
    const encryptedValueBase64 = jsonData[keyName];
    const encryptedBuffer = Buffer.from(encryptedValueBase64, 'base64');

    // Decrypt the value
    const decryptedBuffer = privateKey.decrypt(encryptedBuffer);
    const decryptedValue = decryptedBuffer.toString('utf8');

    return decryptedValue;
}

// Function to save data to a JSON file
function saveToJsonFile(filename, data) {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`Data saved to ${filename}`);
}

// Paths to files
const binFilePath = 'keys/key.bin'; // Path to your RSA.bin file
const jsonFilePath = 'data/data.json'; // Path to your data.json file
const keyName = 'content'; // Key name in JSON to decrypt

// Load private key from the .bin file
const privateKey = loadPrivateKeyFromBinFile(binFilePath);

// Decrypt the value from JSON using the private key
const decryptedValue = decryptValueFromJSON(jsonFilePath, keyName, privateKey);
console.log('Successfully decrypted value');

// Save the decrypted data to a new JSON file
try {
    const parsedDecryptedValue = JSON.parse(decryptedValue);
    const outputJsonFile = 'data/decrypted_data.json'; // Output decrypted JSON file
    saveToJsonFile(outputJsonFile, parsedDecryptedValue);
} catch (error) {
    console.error('Error parsing decrypted JSON:', error);
}
