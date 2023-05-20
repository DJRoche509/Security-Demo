const bcrypt = require('bcryptjs');
let chats = [];

module.exports = {
    createMessage : (req,res) => {
        console.log(req.body);
        // Destructuring the body
        const  { pin, message } = req.body;
        // Check if the pin already exists
        for (let i = 0; i < chats.length; i++){
            // If it does, we can just append to the array
            //compareSync will return true if pin matches and false, otherwise
            const existing = bcrypt.compareSync(pin, chats[i].pinHash)
            if (existing){
                chats[i].messages.push(message);
                // Create a new object to send to the front-end so we can remove the pinHash
                let messagesToReturn = {...chats[i]}
                delete messagesToReturn.pinHash
                res.status(200).send(messagesToReturn)
                return
            }
        }
        // If it does not, we will create a new object and push

        // Encrypt the pin before we send it to the database/array
        const salt = bcrypt.genSaltSync(10);
        // Create pinHash from pin using the hashSync method
        const pinHash = bcrypt.hashSync(pin,salt)
        const newObj = {
            pinHash,
            messages: [message]
        }

        //pushing it to db/array
        chats.push(newObj);
        // Create pinHash from pin using the hashSync method
        let messagesToReturn = { ...newObj};
        delete messagesToReturn.pinHash;
        console.log(chats);
        res.status(200).send(messagesToReturn)
    },
};
