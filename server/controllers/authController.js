const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../core/models/User');
const Role = require('../core/models/Role');
const PersonalInfo = require('../core/models/PersonalInfo');
const {secret} = require('../config');


generateAccessToken = (id, roles) => {
    const payload = {
        id, 
        roles
    }
    return jwt.sign(payload, secret, { expiresIn: "24h"});
}

class authController {
    async registration(req, res) {
        try {
            const data = req.body;
            const candidate = await User.findOne({ username: data.username });
            if(candidate) {
                return res.status(400).json({message: 'Пользователь с таким именем уже существует'})
            }
            if(data.cardId && !validateCardId(data.cardId)) {
                return res.status(400).json({message: 'Вы ввели неправильный номер карты. Пожалуйста, перепроверьте'})
            }
            const hashPassword = bcrypt.hashSync(data.password, 7);
            const userRole = await Role.findOne({value: 'USER'});

            const user = new User({
                username: data.username,
                hashPassword: hashPassword, 
                roles: [userRole.value]
            });
            await user.save();

            const personalInfo = new PersonalInfo({
                user: user._id,
                surname: data.surname,
                name: data.name,
                patronimyc: data.patronimyc,
                nickname: data.nickname,
                dateOfBirth: data.dateOfBirth,
                email: data.email,
                phone: data.phone
            });
            await personalInfo.save();
            return res.json({message: "Регистрация прошла успешно"});
        } catch (e) {
            console.log(e);
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body;
            const user = await User.findOne({username});
            if(!user) {
                return res.status(400).json({message: 'Пользователь с таким именем не найден'});
            }
            const personalInfo = await PersonalInfo.findOne({user: user._id});
            if(personalInfo && !personalInfo.hasAccess) {
                return res.status(400).json({message: 'Вам запрещен доступ к системе'});
            }
            const isValidPassword = bcrypt.compareSync(password, user.hashPassword);
            if(!isValidPassword) {
                return res.status(400).json({message: 'Введен неверный пароль'});
            }
            const token = generateAccessToken(user._id, user.roles);
            return res.json({token});
        } catch (e) {
            return false;
        }
    }

}

module.exports = new authController();