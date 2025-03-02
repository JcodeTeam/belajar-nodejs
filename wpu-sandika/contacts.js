const fs = require("fs");
const chalk = require("chalk");
const validator = require("validator");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
};

const dataPath = "./data/contacts.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
};

const loadContact = () => {
  const file = fs.readFileSync("./data/contacts.json", "utf-8");
  const contact = JSON.parse(file);
  return contact;
};


// Tambah Data
const simpanContact = (nama, email, noHP) => {
  const contact = { nama, email, noHP };
  const contacts = loadContact();

  const duplikat = contacts.find((contact) => contact.nama === nama);
  if (duplikat) {
    console.log(chalk.red.inverse.bold("contact sudah terdaftar, gunakan nama lain!"));
    return false;
  }

  if (email) {
    if (!validator.isEmail(email)) {
      console.log(
        chalk.red.inverse.bold("Email Tidak valid!")
      );
      return false;
    }
  }

  if (!validator.isMobilePhone(noHP, 'id-ID')) {
    console.log(
      chalk.red.inverse.bold("No. HP tidak valid!")
    );
    return false;
  }

  contacts.push(contact);

  fs.writeFileSync(
    "./data/contacts.json",
    JSON.stringify(contacts)
  );
  console.log(chalk.green.inverse.bold("Terimakasih sudah memasukkan data"));
  rl.close();
};

// Tampil Semua Data
const listContact = () => {
  const contacts = loadContact();
  console.log(chalk.green.inverse.bold("Daftar Contact:"));
  contacts.forEach((contact, i) => {
    console.log(`${i + 1}. ${contact.nama} - ${contact.email} - ${contact.noHP}`);
  });
};

// Detail Contact
const detailContact = (nama) => {
  const contacts = loadContact();
  const contact = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase());

  if(!contact){
    console.log(chalk.red.inverse.bold(`${nama} Tidak Ada`));
    return false;
  }
  console.log(chalk.green.inverse.bold("Nama :", contact.nama));
  console.log(chalk.green.inverse.bold("No. HP :", contact.noHP));
  if(contact.email){
    console.log(chalk.green.inverse.bold("Email :", contact.email));
  }
};

// Hapus Contact
const deleteContact = (nama) => {
  const contacts = loadContact();
  const newContact = contacts.filter((contact) => contact.nama.toLowerCase() !== nama.toLowerCase());

  if(contacts.length === newContact.length){
    console.log(chalk.red.inverse.bold(`${nama} Tidak Ada`));
    return false;
  }
  fs.writeFileSync("./data/contacts.json",JSON.stringify(newContact));
  console.log(chalk.green.inverse.bold("Data Berhasil Di hapus!"));
};

module.exports = { simpanContact, listContact, detailContact, deleteContact };
