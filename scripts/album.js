var albumImaginDragons = {
    title: 'Night Visions',
    artist: 'Imagine Dragons',
    label: 'Alternative',
    year: '2012',
    albumArtUrl: 'assets/images/album_covers/03.png',
    songs: [
        {
            title: 'It\'s time',
            duration: '4:00'
        },
        {
            title: 'Demons',
            duration: '2:58'
        },
        {
            title: 'On Top of the World',
            duration: '3:12'
        },
        {
            title: 'Bleeding Out',
            duration: '3:43'
        },
        {
            title: 'UnderDog',
            duration: '3:29'
        }
     ]
};

var albumTFK = {
    title: 'Oxygen: Inhale',
    artist: 'Thousand Foot Krutch',
    label: 'Rock',
    year: '2014',
    albumArtUrl: 'assets/images/album_covers/04.png',
    songs: [
        {
            title: 'Like a Machine',
            duration: '3:44'
        },
        {
            title: 'Untraveled Road',
            duration: '3:56'
        },
        {
            title: 'Born This Way',
            duration: '3:26'
        }
     ]
};

var albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        {
            title: 'Hello, Operator?',
            duration: '1:01'
        },
        {
            title: 'Ring, ring, ring',
            duration: '5:01'
        },
        {
            title: 'Fits in your pocket',
            duration: '3:21'
        },
        {
            title: 'Can you hear me now?',
            duration: '3:14'
        },
        {
            title: 'Wrong phone number',
            duration: '2:15'
        }
     ]
};

var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        {
            title: 'Blue',
            duration: '4:26'
        },
        {
            title: 'Green',
            duration: '3:14'
        },
        {
            title: 'Red',
            duration: '5:01'
        },
        {
            title: 'Pink',
            duration: '3:21'
        },
        {
            title: 'Magenta',
            duration: '2:15'
        }
     ]
};

var createSongRow = function (songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">' + '  <td class="song-item-number">' + songNumber + '</td>' + '  <td class="song-item-title">' + songName + '</td>' + '  <td class="song-item-duration">' + songLength + '</td>' + '</tr>';

    return template;
};

var setCurrentAlbum = function (album) {
    var albumTitle = document.getElementsByClassName('album-view-title')[0];
    var albumArtist = document.getElementsByClassName('album-view-artist')[0];
    var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
    var albumImage = document.getElementsByClassName('album-cover-art')[0];
    var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

    albumTitle.firstChild.nodeValue = album.title;
    albumArtist.firstChild.nodeValue = album.artist;
    albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
    albumImage.setAttribute('src', album.albumArtUrl);

    albumSongList.innerHTML = '';

    for (var i = 0; i < album.songs.length; i++) {
        albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    }
};

window.onload = function () {
    setCurrentAlbum(albumPicasso);
    var cover = document.getElementsByClassName('album-cover-art')[0];

    cover.addEventListener('click', function (event) {
        console.log(event.target);
        var albumList = [albumImaginDragons, albumPicasso, albumMarconi];

        var currentAlbumArtist = document.getElementsByClassName('album-view-artist')[0].textContent;

        console.log(currentAlbumArtist);

        switch (currentAlbumArtist) {
        case albumImaginDragons.artist:
            console.log("image dragon");
            setCurrentAlbum(albumList[Math.floor(Math.random() * 2) + 1]);
            break;
        case albumMarconi.artist:
            console.log("marconi");
            setCurrentAlbum(albumList[Math.floor(Math.random() * 2)]);
            break;
        case albumPicasso.artist:
            console.log("picasso");
            setCurrentAlbum(albumList[0]);
            break;
        default:
            console.log("something wrong")
        }

    });

};