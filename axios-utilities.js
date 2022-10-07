const fs = require('fs')  
const path = require('path')  
const axios = require('axios')

const downloadAxiosFile = async (url, filePath) => {  
  
  const writer = fs.createWriteStream(filePath)

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}
