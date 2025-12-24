const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({ dialect: 'sqlite', storage: 'database.sqlite' });

const Admin = sequelize.define('Admin', {
    username: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING // Will hash later!
});

const Voter = sequelize.define('Voter', {
    loginId: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING
});

sequelize.sync();

module.exports = { Admin, Voter, sequelize };
