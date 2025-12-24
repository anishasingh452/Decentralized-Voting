const express = require('express');
const app = express();
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const cors = require('cors');

// Create single sequelize instance
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
});

// Define Admin model inline
const Admin = sequelize.define('Admin', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Define Voter model inline
const Voter = sequelize.define('Voter', {
    loginId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

app.use(cors());
app.use(express.json());

// Routes
app.post('/register/admin', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await Admin.create({ username, password: hashedPassword });
        res.json({ success: true, message: 'Admin registered' });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

app.post('/login/admin', async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ where: { username } });
        if (!admin) return res.json({ success: false, error: 'Admin not found' });
        const valid = await bcrypt.compare(password, admin.password);
        if (valid) res.json({ success: true, message: 'Admin logged in' });
        else res.json({ success: false, error: 'Invalid password' });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

app.post('/register/voter', async (req, res) => {
    const { loginId, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await Voter.create({ loginId, password: hashedPassword });
        res.json({ success: true, message: 'Voter registered' });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

app.post('/login/voter', async (req, res) => {
    const { loginId, password } = req.body;
    try {
        const voter = await Voter.findOne({ where: { loginId } });
        if (!voter) return res.json({ success: false, error: 'Voter not found' });
        const valid = await bcrypt.compare(password, voter.password);
        if (valid) res.json({ success: true, message: 'Voter logged in' });
        else res.json({ success: false, error: 'Invalid password' });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

// Sync database and start server
sequelize.sync().then(() => {
    console.log('Database synced');
    app.listen(8080, () => {
        console.log('Server running on http://localhost:8080');
    });
}).catch(err => {
    console.error('Error syncing database:', err);
});
