const PersonalInfo = require('../models/PersonalInfo');
const UserError = require('../customError');

validateCardId = (cardId) => {
    const digits = cardId.replace(/\D/g, '').split('').map(Number);

    if (!/^\d+$/.test(cardId) || digits.length !== 16) {
        return false;
    }

    let sum = 0;
    let even = false;
  
    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = digits[i];
        if (even) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
        even = !even; 
    }

    return sum % 10 === 0;
}

class UserInfoService {
    async getUsers() {
        try {
            const users = await PersonalInfo.find();
            return users;
        } catch (error) {
            return error;
        }
    }

    async getManagers(page, pageSize) {
        try {
            let aggregationPipeline = [
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
                        as: 'userInfo'
                    }
                },
                {
                    $addFields: {
                        surname: '$surname',
                        name: '$name',
                        patronimyc: '$patronimyc',
                        dateOfBirth: '$dateOfBirth',
                        email: '$email',
                        phoneNumber: '$phoneNumber',
                        userId: { $arrayElemAt: ['$userInfo._id', 0] },
                        username: { $arrayElemAt: ['$userInfo.username', 0] },
                    }
                },
                {
                    $match: {
                        'userInfo.roles': { $elemMatch: { $eq: 'CONTENT-MANAGER' } }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        userId: 1,
                        username: 1,
                        surname: 1,
                        name: 1,
                        patronimyc: 1,
                        dateOfBirth: 1,
                        email: 1,
                        phoneNumber: 1
                    }
                },
                {
                    $skip: (page - 1) * pageSize
                },
                {
                    $limit: pageSize
                }
            ];

            let managers = await PersonalInfo.aggregate(aggregationPipeline);
            return managers;
        } catch (error) {
            return error;
        }
    }

    async addWallet(userId, cardId) {
        try {
            if(!cardId || !validateCardId(cardId)) {
                throw new UserError('Вы ввели неправильный номер карты. Пожалуйста, перепроверьте');
            }
            
            const user = await PersonalInfo.findOne({ user: userId });
            if (!user) {
                throw new UserError('Пользователь не найден');
            }
            user.cardIdFirstDigits = cardId.slice(0, 6);
            user.cardIdLastDigits = cardId.slice(-4);
            user.hasLinkedCard = true;
            await user.save();
        } catch (error) {
            return error;
        }
    }

    async getById(userId) {
        try {
            const user = await PersonalInfo.findOne( {user : userId});
            return user;
        } catch (error) {
            return error;
        }
    }
}

module.exports = new UserInfoService();