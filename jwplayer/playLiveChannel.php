<?php

/* Template Name: Livestream */

?>

<div id="livestreamHere">
</div>

<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script src="https://cdn.jwplayer.com/libraries/cMOIm6qH.js"></script>


<script>
const divIdWherePlayerGoes = 'livestreamHere';
const jwChannelMediaId = "JUELnFMu";
const jwPlayerMediaId = "1qbsyg1s";
let checkVideo = true;

const I = id => document.getElementById(id);
const Q = selector => document.querySelector(selector);
const A = selector => document.querySelectorAll(selector);

function createElement(parent, tag, c = false, text = false, attributes = false, style = null) {
    let el = {};
    try {
        el = document.createElement(tag);
    } catch (e) {
        return false;
    }

    let parentEl = null;
    try {
        if (parent) {
            if (typeof parent === 'string') parentEl = document.querySelector(parent);
            else parentEl = parent;

            if (parentEl) parentEl.appendChild(el);
        }
        if (c) el.className = c;
        if (text) el.innerText = text;
        if (attributes) {
            for (const [key, value] of Object.entries(attributes)) {
                el.setAttribute(key, value);
            };
        }
        if (style) {
            for (const [key, value] of Object.entries(style)) {
                el.style[key] = value;
            };
        }
    } catch (e) {
        console.error(e);
        return false;
    }

    return el
}
const id = document.getElementById('livestreamHere');

const getMediaPlaylist = mediaId => {
    return new Promise((resolve, reject) => {
        let request = {
            url: `https://cdn.jwplayer.com/v2/media/${mediaId}`,
            method: 'get'
        }
        axios(request)
        .then(response => resolve(response.data))
        .catch(error => reject(error))
    })
}

const getChannelStatus = channelId => {
    return new Promise((resolve, reject)=>{
        let request = {
            url: `https://cdn.jwplayer.com/live/channels/${channelId}.json`,
            method: 'get'
        }
        axios(request)
        .then(response => resolve(response.data))
        .catch(error => reject(error))
    });
}

async function playLiveChannel(divId, channelId) {
    info = await getChannelStatus(channelId);
    console.log(info);

    const {status} = info;

    if (status === 'active') {
        let mediaId = info.current_event;

        console.log('playLiveEvent', mediaId);

        let playlist;

        try {
            playlist = await getMediaPlaylist(mediaId);
        } catch (e) {
            console.error(e);
            return true;
        }

        const injectionSite = I(divId);
        injectionSite.innerHTML = '';
        createElement(injectionSite, 'div', 'live-player', false, {id: divId});

        livePlayer = jwplayer(divId).setup({
                "playlist": playlist,
                "autostart": true,
                "repeat": false,
                "mute": true,
                "controlbar":false
            })

        livePlayer.on('ready', () => {
            livePlayer.on('playlistComplete', () => {
                checkVideo = true;
                console.log('Video all done');
                injectionSite.innerHTML = 'All done';

            })});

        return false;
    }
    return true;
}

document.addEventListener("DOMContentLoaded", () => { 
    console.log('here here here');

    let interval = setInterval(async () => {
        checkVideo = await playLiveChannel('livestreamHere', 'JUELnFMu');
        console.log('checkVide', checkVideo);
        if (!checkVideo) {
            clearInterval(interval);
            console.log("cleared interval");
        }
    }, 5000);
    
})

</script>

