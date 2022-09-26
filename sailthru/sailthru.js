const require('dotenv').config();

const { API_KEY, API_SECRET } = process.env;
const sailthru = require('sailthru-client').createSailthruClient(API_KEY, API_SECRET);

const show = info => {
    console.log(JSON.stringify(info, null, 4));
}

const sailthruPost = async (endpoint, params) => {
    return new Promise((resolve, reject) => {
        sailthru.apiPost(endpoint, params, (error, response) => {
            if (error) reject(error);
            else resolve(response);
        })
    })
}

const sailthruGet = async (endpoint, params) => {
    return new Promise((resolve, reject) => {
        sailthru.apiGet(endpoint, params, (error, response) => {
            if (error) reject(error);
            else resolve(response);
        })
    })
}


const test = async () => {

    let data;

    try {
        data = await sailthruGet('content', {items: 2});
        show(data);

        const url = data.content[0].url;
        console.log(url);

        let info = {
            key: 'url',
            id: url,
            tags: ['b2b', 'crypto']
        }

        //data = await sailthruPost('content', info);
        //console.log(data);        

    } catch (e) {
        console.log(e);
    }
}

test();

