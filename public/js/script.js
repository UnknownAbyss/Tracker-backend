function generatePass() {
    let pass = '';
    let str = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789@#$';
 
    for (let i = 1; i <= 8; i++) {
        let char = Math.floor(Math.random() * (str.length));
        pass += str.charAt(char)
    }
    return pass;
}