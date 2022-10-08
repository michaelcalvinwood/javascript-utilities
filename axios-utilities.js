const fs = require('fs')  
const path = require('path')  
const axios = require('axios')

const axiosDownloadFile = async (url, filePath) => {  
  return new Promise(async (resolve, reject) => {
    const writer = fs.createWriteStream(filePath)
    writer.on('finish', resolve)
    writer.on('error', reject)

    let response;
    try {
       response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
      })
    } catch (e) {
      reject(e);
      return;
    }
  
    response.data.pipe(writer)
  })
}
