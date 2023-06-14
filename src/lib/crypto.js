import * as CryptoJS from 'crypto-js'
import * as argon2 from 'argon2-browser'

const hashPassword = async (password) => {
    const hash = await argon2.hash({
        pass: password,
        salt: process.env.NEXT_PUBLIC_SALT,
        type: argon2.ArgonType.Argon2id
    })
    return hash.encoded
}

const verifyPassword = async (encHash, password) => {
    return await argon2.verify({
        pass: password,
        encoded: encHash,
        type: argon2.ArgonType.Argon2id
    });

}

const encrypt = async (message, short_uri) => {
    return await CryptoJS.AES.encrypt(message, short_uri).toString()
}

const decrypt = async (encryptedText, short_uri) => {
    const decrypted = CryptoJS.AES.decrypt(encryptedText, short_uri)
    if (decrypted) {
        try {
            console.log(decrypted)
            const str = decrypted.toString(CryptoJS.enc.Utf8)
            if (str.length > 0) {
                return str
            } else {
                return 'error 1'
            }
        } catch (e) {
            return `${e}`
        }
    }
    return 'error 3'
}

module.exports = { hashPassword, verifyPassword, encrypt, decrypt };


