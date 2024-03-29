const readJsonFile = fn => {
    return JSON.parse(fs.readFileSync(path.resolve(fn), { encoding: 'utf8', flag: 'r' }));
}

const writeJsonFile = (data, fn) => {
    fs.writeFileSync(path.resolve(fn), JSON.stringify(data));
} 

const writeCreateFileSync = (data, fn) => {
    fs.mkdirSync(path.resolve(fn), { recursive: true }, (error) => console.log(error));
    fs.writeFileSync(path.resovle(fn), data);
}

const getAllFilesInFolder = folder => {
    return new Promise((resolve, reject) => {
        fs.readdir(folder, (err, files) => {
            //handling error
            if (err) {
                reject(err)
                return;
            } 
      
            resolve(files);
        })
    })
    
}