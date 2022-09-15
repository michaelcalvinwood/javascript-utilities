const I = id => document.getElementById(id);
const Q = selector => document.querySelector(selector);
const A = selector => document.querySelectorAll(selector);

const playChannel = (elementId, playlistId, options = {}) => {
    const request = {
        url: `https://cdn.jwplayer.com/v2/playlists/${playlistId}`,
        method: 'get'
    }
    axios(request)
    .then(response => {
            const { playlist } = response.data;

            console.log(playlist);
            let totalDuration = 0;
            for (let i = 0; i < playlist.length; ++i) totalDuration += playlist[i].duration;
            console.log('total duration', totalDuration);

            const timeParts =  new Date().toLocaleString('en-US').split(' ');
            console.log(timeParts);
            const abc = timeParts[1].split(":");
            console.log(abc);

            let hour = parseInt(abc[0]);
            let minute = parseInt(abc[1]);
            let second = parseInt(abc[2]);

            console.log('hour', hour, typeof hour);

            if (timeParts[2] == 'PM' && hour < 12) hour += 12;

            const totalSeconds = (hour * 3600) + (minute * 60) + second;

            console.log('totalSeconds', totalSeconds);

            jwplayer(elementId).setup({
                playlist
            });

            //jwplayer(elementId).playlistItem(10);
            //jwplayer().seek(position)

    })
    .catch(error => {
        I(elementId).innerText = `Unknown Playlist: ${playlistId}: ${request.url}`;
    })

}



document.addEventListener("DOMContentLoaded", () => {
    const time = new Date().toLocaleString('en-US');
    document.getElementById('currentTime').innerText = time;

    playChannel('thePlayer', 'Yqa42ej5');
});
