const PersonalInfo = require('../core/models/PersonalInfo');


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

class userInfoController {
    async getUsers(req, res) {
        try {
            const users = await PersonalInfo.find();
            console.log(users);
            res.json(users);

        } catch (e) {
            console.log(e);
        }
    }

    async addWallet(req, res) {
        try {
            const userId = req.userId;
            const cardId = req.body.cardId;
            if(!cardId || !validateCardId(cardId)) {
                return res.status(400).json({message: 'Вы ввели неправильный номер карты. Пожалуйста, перепроверьте'})
            }
            
            const user = await PersonalInfo.findOne({ user: userId });
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            user.cardIdFirstDigits = cardId.slice(0, 6);
            user.cardIdLastDigits = cardId.slice(-4);
            user.hasLinkedCard = true;
            await user.save();
        } catch (e) {
            
        }
    }
}

module.exports = new userInfoController();