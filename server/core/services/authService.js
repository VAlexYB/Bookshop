const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Role = require('../models/Role');
const PersonalInfo = require('../models/PersonalInfo');

const {secret} = require('../../config');
const UserError = require('../customError');

generateAccessToken = (id, roles) => {
    const payload = {
        id, 
        roles
    }
    return jwt.sign(payload, secret, { expiresIn: "24h"});
}

class AuthService {
    async registration(data) {
        try {
            const candidate = await User.findOne({ username: data.username });
            console.log(candidate);
            if(candidate) {
                throw new UserError('Пользователь с таким именем уже существует');

            }
            if(data.cardId && !validateCardId(data.cardId)) {
                throw new UserError('Вы ввели неправильный номер карты. Пожалуйста, перепроверьте')
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
                phone: data.phone,
                hasLinkedCard: false
            });

            await personalInfo.save();
            return true;
        } catch (e) {
            throw e;
        }
    }

    async login(data) {
        try {
            const {username, password} = data;
            const user = await User.findOne({username});
            if(!user) {
                throw new UserError('Пользователь с таким именем не найден');
            }
            const personalInfo = await PersonalInfo.findOne({user: user._id});
            // if(personalInfo && !personalInfo.hasAccess) {
            //     throw new Error('Вам запрещен доступ к системе');
            // }
            const isValidPassword = bcrypt.compareSync(password, user.hashPassword);
            if(!isValidPassword) {
                throw new UserError('Введен неверный пароль');
            }
            const token = generateAccessToken(user._id, user.roles);
            return {token};
        } catch (e) {
            throw e;
        }
    }
}

module.exports = new AuthService();