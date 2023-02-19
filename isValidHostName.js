const isValidHostName = name => {
    if (!name) return false;
    
    if (name.startsWith('-')) return false;
    if (name.endsWith('-')) return false;

    let test = name.indexOf('--');
    if (test !== -1) return false;

    return (/^[a-zA-Z0-9-]{1,63}$/.test(name))
}

const host = 'd'
console.log(isValidHostName(host));