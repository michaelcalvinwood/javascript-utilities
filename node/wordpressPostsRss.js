// common ports
const pulsePort = 5102;
const URL_BASE = 'https://pymnts.com';

require('dotenv').config();
const express = require("express");
const app = express();
const xml = require('xml');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const luxon = require('luxon');
const { getEnabledCategories } = require('trace_events');

const unescape = require('unescape');

// connect to redis
const redisPackage = require('redis');
const redis = redisPackage.createClient({password: process.env.REDIS_PASSWORD});
let redisConnected = false;

redis.on('connect', async () => {
  let result;
  redisConnected = true;

  // register pulse
  await redis.sAdd('pulses', `http://127.0.0.1:${pulsePort}/pulse`);

});
redis.on('error', err => {
  console.error('Redis Error', err);
})
redis.connect();

// connect to mysql

const mysql = require('mysql');

const dbPoolInfo = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT),
  queueLimit: Number(process.env.DB_QUEUE_LIMIT),
  charset: 'utf8'
}

dbPool = mysql.createPool(dbPoolInfo);

function sqlQuery (query) {
    console.log(query);
  return new Promise ((resolve, reject) => {
      dbPool.query(query, (err, res, fields) => {
          if (err) {
              reject(err);
              return;
          }
          resolve({
              res,
              fields
          })
      })
  })
}

// mysql functions

const insertInfo = (table, id, data) => {
    return new Promise((resolve, reject) => {
      const info = mysql.escape(JSON.stringify(data));
      const sql = `REPLACE INTO ${table} (id, info) VALUES (${id}, ${info})`;
      sqlQuery(sql)
      .then(response => resolve(response))
      .catch(error => reject(error));
    })
  }
  
const getInfo = (table, id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT info FROM ${table} WHERE id = ${id}`;
    sqlQuery(sql)
    .then(response => {
      let info = response.res.length ? JSON.parse(response.res[0].info) : false;
      resolve(info);
    })
    .catch(error => reject(error));
  })
}

function show (info, label = '') {
    if (label) console.log (label, JSON.stringify(info, null, 4));
    else console.log (JSON.stringify(info, null, 4));
}
  

/* START HERE */

let options = {
  declaration: true,
  indent: "\t"
}

const writeCreateFileSync = (data, fn) => {
  const resolvedFn = path.resolve(fn);
  const resolvedDir = path.dirname(resolvedFn);
  console.log(resolvedDir, resolvedFn);

  fs.mkdirSync(resolvedDir, { recursive: true }, (error) => console.log(error));
  fs.writeFileSync(resolvedFn, data);
}

const getMediaInfo = featuredMedia => {  
  return new Promise (async (resolve, reject) => {
    if (!featuredMedia) {
      reject(`Invalid media id: ${featuredMedia}`);
      return;
    }

    let result;
    try {
      result = await getInfo('featured_media', featuredMedia);
      if (result) {
        console.log('got featured media: ', featuredMedia);
        show(result);
        resolve(result);
        return;
      }
    } catch(e) {
      console.error(e);
    }

    let request = {
      url: `https://pymnts.com/wp-json/wp/v2/media/${featuredMedia}`,
      method: 'get',
      timeout: 10000
    }
    console.log(request.url);

    let response;
    try {
      response = await axios(request);
    } catch(e) {
      console.error(e);
      resolve('');
      return;
    }

    try {
      result = await insertInfo('featured_media', featuredMedia, response.data);
    } catch(e) {
      console.error(e);
    }
    resolve(response.data);
  })
}


const getAuthor = async author => {
  return new Promise (async (resolve, reject) => {
    if (!author) {
      reject(`invalid author id: ${author}`);
      return;
    }

    let key = `author:${author}`;
    let test;
    try {
      test = await redis.get(key);
    } catch(e) {
      console.error(e);
      test = false;
    }
    if (test) {
      console.log(`cache author [${author}]: ${test}`);
      resolve(test);
      return;
    }

    let request = {
      url: `${URL_BASE}/wp-json/wp/v2/users/${author}`,
      method: 'get',
      timeout: 10000
    }
    console.log(request.url);
    let response;
    
    try {
      response = await axios(request);
      console.log(response.data.name);
      console.log('setting author in redis');
      await redis.set(key, response.data.name);
      resolve(response.data.name);
    } catch(e) {
      console.error(e);
      reject(e);
    }
  })
}


const getCategory = async category => {
  return new Promise(async (resolve, reject) => {
      let key = `category:${category}`;
      let test; 
      try {
          test = await redis.get(key);
      } catch (e) {
          console.error(e);
          test = false;
      }
      if (test) {
          console.log(`cache category [${category}]: ${test}`);
          resolve(test);
          return;
      }

      let request = {
          url: `${URL_BASE}/wp-json/wp/v2/categories/${category}`,
          method: 'get',
          timeout: 10000
      }
      console.log(request.url);
      let response;
      
      try {
          response = await axios(request);
          console.log(response.data.name);
          await redis.set(key, response.data.name);
          resolve(response.data.name);
      } catch(e) {
          console.error(e);
          resolve(false);
      }
    });
}

const getTag = async tag => {
  return new Promise(async (resolve, reject) => {
      let key = `tag:${tag}`;
      let test; 
      try {
      test = await redis.get(key);
      } catch (e) {
      console.error(e);
      test = false;
      }
      if (test) {
          console.log(`cache tag [${tag}]: ${test}`);
          resolve(test);
          return;
      }

      let request = {
          url: `${baseUrl}/wp-json/wp/v2/tags/${tag}`,
          method: 'get',
          timeout: 10000
      }
      console.log(request.url);
      let response;
      
      try {
          response = await axios(request);
          console.log(response.data.name);
          await redis.set(key, response.data.name);
          resolve(response.data.name);
      } catch(e) {
          console.error(e);
          reject(e);
          
      }
    });
}


const getCategories = async post => {
  let  i;
  let categories = new Set();

  if (post.categories) {
      for (i = 0; i < post.categories.length; ++i) {
          let category = await getCategory(post.categories[i]);
          categories.add(unescape(category.toLowerCase()));
      }
  }

  if (post.tags) {
      for (i = 0; i < post.tags.length; ++i) {
          let tag = await getTag(post.tags[i]);
          categories.add(unescape(tag.toLowerCase()));
      }
  }

  let catArray = Array.from(categories);
  console.log(catArray);
  return catArray;

}

const getItemObject = (title, link, pubDate, description) => {
  let f = {};
  f.item = [];
  f.item.push({title});
  f.item.push({link});
  f.item.push({pubDate});
  f.item.push({
      description: {
          _cdata: description
      }
  })
  let contentEncode = {};
  contentEncode['content:encoded'] = {_cdata: description};
  f.item.push(contentEncode);
  return f;
}

const reduceContent = (content, link) => {
  let loc = content.indexOf('<p');
  if (loc === -1) return content;

  loc = content.indexOf('<p', loc+3);
  if (loc === -1) return content;

  loc = content.indexOf('<p', loc+3);
  if (loc === -1) return content;

  loc = content.indexOf('<p', loc+3);
  if (loc === -1) return content;

  return (content.substring(0, loc) + `<p>Continue reading at original source: <a href="${link}">${link}</a></p>`);
}

const addPostsToChannel = async (posts, channel) => {
  for (let i = 0; i < posts.length; ++i) {
      let post = posts[i];
      let title = post.title.rendered;
      let link = post.link;
      let excerpt = post.excerpt.rendered;
      let content = post.content.rendered;
      let isoDate = post.date_gmt;
      let pubDate = luxon.DateTime.fromISO(isoDate).toRFC2822();
      let mediaId = post.featured_media;
      let authorId = post.author;
      let categories = await getCategories(post);
      
      // get media to prepend to description and content:encoded
      let prepend = '';

      let mediaInfo;
      let mediaUrl = '';
      let mediaBigUrl = '';
      let mediaMedium = '';
      let mediaType = '';
      let mediaDuration = 10;

      switch(post.format) {
          case 'video':
              console.log(`HANDLE VIDEO HERE: ${post.id}`);

              //break;
          default:
              mediaInfo = await getMediaInfo(mediaId);
              if (!mediaInfo) {
                console.log(`ERROR: Could not resove Media Info for ${mediaInfo}`);
                continue;
              }
              mediaUrl = mediaInfo.media_details.sizes['mvp-medium-thumb'].source_url;
              mediaBigUrl = mediaInfo.media_details.sizes['post-thumbnail'].source_url;
              mediaMedium = mediaInfo.media_type;
              mediaType = mediaInfo.mime_type;
              mediaDuration = 10;

              prepend = `<div style="width: 100%"><a href="${link}"><img src=${mediaUrl} width="450" height="270" style="margin:auto; display:block"/></a></div><h1 sytle="text-align:center;">${title}</h1>`

              prepend = `<div style="width: 100%"><a href="${link}"><img src=${mediaUrl} width="450" height="270" style="margin:auto; display:block"/></a></div>`
              
              
              console.log('prepend', prepend);
      }

      
      // get description (d)
      let description = {}
      description.description = {_cdata : prepend + excerpt.trim()};

      // get content:encoded
      let contentEncoded = {};
      content = reduceContent(content, link);
      contentEncoded['content:encoded'] = {_cdata: prepend + content.trim()};

      // get author/creator info
      let author = await getAuthor(authorId);
      let dcCreator = {};
      author = author.trim();
      dcCreator['dc:creator'] = {_cdata: author}
  
      // create item object
      let o = {};
      o.item = [];
      let item = o.item;

      // push item content

      // TODO: media:content
      let mediaContent = {};
      mediaContent['media:content'] = {
          _attr : {
              medium: mediaMedium,
              type: mediaType,
              url: mediaUrl,
              duration: mediaDuration
          }
      }
      item.push(mediaContent);

      let mediaThumbnail = {};
      mediaThumbnail['media:thumbnail'] = {
          _attr: {
              url: mediaBigUrl
          }
      }
      item.push(mediaThumbnail);
     
      item.push({title});
      item.push({link});
      item.push({guid : link});
      //item.push({author});
      item.push(dcCreator);
      item.push({pubDate})
      item.push(description);
      item.push(contentEncoded);

      // add categories

      for (let j = 0; j < categories.length; ++j) {
          let category = {};
          category.category = {_cdata: categories[j]};
          item.push(category);
      }
      // let analyticsPage = `SmartNews: ${title}`;

      // let analyticsScript = `<script>
      // (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      // (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      // m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      // })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    
      // ga('create', 'UA-11167465-1', 'pymnts.com');
      // ga('require', 'displayfeatures');
      // ga('set', 'referrer', 'http://www.smartnews.com/');
      // ga('send', 'pageview', {
      //     title: '${analyticsPage}'
      // });
      //   </script>`
      // let snfAnalytics = {};
      // snfAnalytics['snf:analytics'] = {_cdata: analyticsScript};
      // item.push(snfAnalytics);
      channel.push(o);
  }
}

let lastPostId = 0;
let lastPostModified = '';

const updatePublicNewsFeed = async (numPosts) => {
  let feed = { rss: []};
  
  // configure <rss>
  let rssFeed = feed.rss;
  
  rssFeed.push({
      _attr: {
          version: '2.0'
      },
  });
  const rssFeedAttr = rssFeed[0]._attr;
  rssFeedAttr['xmlns:content'] = "http://purl.org/rss/1.0/modules/content/";
  rssFeedAttr['xmlns:wfw'] = "http://wellformedweb.org/CommentAPI/";
  rssFeedAttr['xmlns:atom'] = "http://www.w3.org/2005/Atom";
  rssFeedAttr['xmlns:sy'] = "http://purl.org/rss/1.0/modules/syndication/";
  rssFeedAttr['xmlns:slash'] = "http://purl.org/rss/1.0/modules/slash/";
  rssFeedAttr['xmlns:dc'] = "http://purl.org/dc/elements/1.1/";
  rssFeedAttr['xmlns:media'] = "http://search.yahoo.com/mrss/";
  //rssFeedAttr['xmlns:snf'] = "http://www.smartnews.be/snf";
  
  // configure <channel>
  rssFeed.push({ channel: [] })
  let rssChannel = rssFeed[1].channel;
  
  rssChannel.push( { title: "PYMNTS.com" });
  let channelAtom = {};
  channelAtom['atom:link'] = {
      _attr: {
          href: "https://services.pymnts.com/feeds/public/rss/rss.xml",
          rel: "self",
          type: "application/rss+xml"
      }
  }
  rssChannel.push(channelAtom);
  rssChannel.push({ link: "https://www.pymnts.com" });
  rssChannel.push({description: "What's next in payments and commerce"});
      let curDate = new Date();
  rssChannel.push({lastBuildDate: luxon.DateTime.fromJSDate(curDate).toRFC2822()});
  rssChannel.push({language: "en-US"});
      let syUpdatePeriod = {};
      syUpdatePeriod['sy:updatePeriod'] = 'hourly';
  rssChannel.push(syUpdatePeriod);
      let syUpdateFrequency = {};
      syUpdateFrequency['sy:updateFrequency'] = 1;
  rssChannel.push(syUpdateFrequency);
  rssChannel.push({generator: 'Pymnts RSS Generator'})
      let channelImage = [];
      channelImage.push({url: "https://www.pymnts.com/wp-content/uploads/2019/04/cropped-512-1-32x32.jpg"});
      channelImage.push({title: 'PYMNTS.com'});
      channelImage.push({link: 'https://www.pymnts.com'});
      channelImage.push({width: 32});
      channelImage.push({height: 32});
  rssChannel.push({image: channelImage});
  //     let snfLogo = {};
  //     snfLogo['snf:logo'] = [{url: 'https://services.pymnts.com/smartnews/PYMNTS-700x100-80h.png'}];

  // rssChannel.push(snfLogo);

  // get latest posts and add to rss channel as item objects

  let request = {
      url: `https://pymnts.com/wp-json/wp/v2/posts/?type=posts&per_page=${numPosts}`,
      method: 'get',
      timeout: 25000
  }
  console.log(request.url);

  let response;

  try {
      response = await axios(request);
      await addPostsToChannel(response.data, rssChannel);
  } catch (error) {
      console.log(error);
  }
  
  // let description = '<a href="https://www.pymnts.com/news/regulation/2022/europe-stamps-digital-services-act-with-final-approval/" title="Europe Stamps Digital Services Act With Final Approval" rel="nofollow"><img width="450" height="270" src="https://securecdn.pymnts.com/wp-content/uploads/2022/10/digital-services-act-ec-450x270.jpg" class="webfeedsFeaturedVisual wp-post-image" alt="Digital Services Act, DSA, legislation, EU" loading="lazy" style="display: block; margin: auto; margin-bottom: 5px;max-width: 100%;" link_thumbnail="1" srcset="https://securecdn.pymnts.com/wp-content/uploads/2022/10/digital-services-act-ec-450x270.jpg 450w, https://securecdn.pymnts.com/wp-content/uploads/2022/10/digital-services-act-ec-258x155.jpg 258w, https://securecdn.pymnts.com/wp-content/uploads/2022/10/digital-services-act-ec-457x274.jpg 457w, https://securecdn.pymnts.com/wp-content/uploads/2022/10/digital-services-act-ec-768x461.jpg 768w, https://securecdn.pymnts.com/wp-content/uploads/2022/10/digital-services-act-ec-1000x600.jpg 1000w, https://securecdn.pymnts.com/wp-content/uploads/2022/10/digital-services-act-ec-300x180.jpg 300w, https://securecdn.pymnts.com/wp-content/uploads/2022/10/digital-services-act-ec-150x90.jpg 150w, https://securecdn.pymnts.com/wp-content/uploads/2022/10/digital-services-act-ec.jpg 1200w" sizes="(max-width: 450px) 100vw, 450px" /></a>The European Council has officially approved legislation that aims to ensure a safer and more transparent online environment with greater accountability and protection. The Digital Services Act (DSA), packaged with the Digital Marketing Act (DMA), requires transparency from technology platforms as well as accountability in their role as disseminators of content, according to a statement [&#8230;]';
  
  // let itemObject = getItemObject(
  //     'Europe YOYO Stamps Digital Services Act With Final Approval',
  //     "https://www.pymnts.com/news/regulation/2022/europe-stamps-digital-services-act-with-final-approval/",
  //     'Tue, 04 Oct 2022 16:49:32 +0000',
  //     description
  //     )
  
  // rssChannel.push(itemObject);
  //console.log(xml(feed, options));

  writeCreateFileSync(xml(feed, options), '/var/www/services.pymnts.com/feeds/public/rss/rss.xml');
}


const handleNewPosts = async data => {
  console.log('got new post(s): update feed');

}

const getLastPosts = async (numPosts) => {
  let request = {
      url: `https://pymnts.com/wp-json/wp/v2/posts/?type=posts&per_page=${numPosts}`,
      method: 'get',
      timeout: 25000
  }
  console.log(request.url);
  //request.url="https://pymnts.com";

  let response;

  try {
      response = await axios(request);
      console.log(response);
      // const { id, modified_gmt, link } = response.data[0];
      // if (id !== lastPostId || modified_gmt !== lastPostModified) {
      //     lastPostId = id;
      //     lastPostModified = modified_gmt;
      //     handleNewPosts(response.data);
      // }
      
  }    
  catch(err) {
      console.error(err);
      return;
  }
}

// getLastPosts(10);

// setInterval(() => {
//     getLastPosts(10);
// }, 120000)







const handlePulse = pulse => {
  return new Promise(async (resolve, reject) => {
      let post;
      
      try {
          // get the post from the database
          await updatePublicNewsFeed(15);
         
      } catch(e) {
          console.error(e);
      }

      resolve('pulse resolved')
  })
}


// middleware

app.use((req, res, next) => {
    console.log(req.url);
    next();
  });

app.use('/pulse', express.json());

// routes

app.get('/', (req, res) => {
    res.status(200).send('ok');
})

app.post('/pulse', (req, res) => {
    console.log(req.body);
    res.status(200).send('pulse');
    handlePulse(req.body);
})

app.listen(pulsePort, '127.0.0.1', () => {
    console.log(`listening on localhost ${pulsePort}`)
})