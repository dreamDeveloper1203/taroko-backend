const fs = require('fs');

//const rawdata = fs.readFileSync(__dirname + '/contacts.json');
// const contacts = JSON.parse(rawdata);

const getContacts = () => {
  try {
    const rawdata = fs.readFileSync(__dirname + '/contacts.json');
    return JSON.parse(rawdata);
  } catch (e) {
    return [];
  }
};

const writeContacts = (contacts) => fs.writeFileSync(__dirname + '/contacts.json', JSON.stringify(contacts));

module.exports = {
  getContacts,
  writeContacts,
};