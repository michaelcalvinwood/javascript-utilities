const fs = require('fs')  
const path = require('path')  
const axios = require('axios')

const axiosDownloadFile = async (url, filePath) => {  
  return new Promise(async (resolve, reject) => {
    const writer = fs.createWriteStream(filePath)
    writer.on('finish', resolve)
    writer.on('error', reject)

    try {
       const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
      });
      response.data.pipe(writer)
    } catch (e) {
      reject(e);
      return;
    }
  })
}
