module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777"   // <-- must match what Ganache shows
    }
  },
  compilers: {
    solc: {
      version: "0.8.17"
    }
  }
};
