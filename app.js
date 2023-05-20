const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

const user = [
    { id: 1, username: 'user1', password: 'password1', loginAttempts: 0 },
    { id: 2, username: 'user2', password: 'password2', loginAttempts: 0 },
    { id: 3, username: 'user3', password: 'password3', loginAttempts: 0 }
];

// 用于存储已登录的用户，以便限制尝试登录次数
let users = {};

// 生成JWT token的密钥
const secretKey = 'my_secret_key';
app.use(express.json());
// 登录接口
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // 检查用户是否已登录并超过登录次数限制
    if (users[username] && users[username].loginAttempts >= 3) {
        const now = new Date();
        const lastAttempt = new Date(users[username].lastAttempt);
        const timeDifference = (now.getTime() - lastAttempt.getTime()) / 1000 / 60 / 60;
        if (timeDifference < 24) {
            return res.status(401).json({ message: `账号已锁定，请等待 ${24 - Math.round(timeDifference)} 小时后再试` });
        } else {
            users[username].loginAttempts = 0;
            users[username].lastAttempt = null;
        }
    }

    // 模拟验证密码是否正确
    const isPasswordCorrect = password === user.find(u => u.username === username).password;

    if (!isPasswordCorrect) {
        // 密码错误，增加尝试次数
        if (!users[username]) {
            users[username] = {
                loginAttempts: 1,
                lastAttempt: new Date()
            };
        } else {
            users[username].loginAttempts++;
            users[username].lastAttempt = new Date();
        }
        return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 生成JWT token
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

    // 返回token
    return res.status(200).json({ token });
});

app.listen(3000, () => console.log('Server started on port 3000'));
