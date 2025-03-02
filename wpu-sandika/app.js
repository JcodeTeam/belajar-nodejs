const contacts = require("./contacts");
const yargs = require("yargs");

yargs.command({
    command: "add",
    describe: "Menambahkan Data",
    builder: {
      nama: {
        describe: "Nama : ",
        demandOption: true,
        type: "string",
      },
      email: {
        describe: "Email : ",
        demandOption: false,
        type: "string",
      },
      noHP: {
        describe: "No. HP : ",
        demandOption: true,
        type: "string",
      },
    },
    handler(argv) {
      contacts.simpanContact(argv.nama, argv.email, argv.noHP);
    },
  }).demandCommand();

yargs.command({
    command: "list",
    describe: "Menampilkan Data",
    handler() {
      contacts.listContact();
    },
  }).demandCommand();

yargs.command({
    command: "detail",
    describe: "Melihat Detail Data",
    builder: {
      nama: {
        describe: "Nama : ",
        demandOption: true,
        type: "string",
      },
    },
    handler(argv) {
      contacts.detailContact(argv.nama);
    },
  }).demandCommand();

yargs.command({
    command: "hapus",
    describe: "Hapus Data",
    builder: {
      nama: {
        describe: "Nama : ",
        demandOption: true,
        type: "string",
      },
    },
    handler(argv) {
      contacts.deleteContact(argv.nama);
    },
  }).demandCommand();

yargs.parse();
