const readJsonFile = fn => {
    return JSON.parse(fs.readFileSync(path.resolve(fn), { encoding: 'utf8', flag: 'r' }));
}

const writeJsonFile = (data, fn) => {
    fs.writeFileSync(path.resolve(fn), JSON.stringify(data));
} 
