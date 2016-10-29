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
        '<tr class="album-view-song-item">' + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' + '  <td class="song-item-title">' + songName + '</td>' + '  <td class="song-item-duration">' + songLength + '</td>' + '</tr>';

    return $(template);
};

var setCurrentAlbum = function (album) {
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');

    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);


    $albumSongList.empty();

    for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};

//find the target parent of given child
//return null if there isn't any
var findParentByClassName = function (child, targetParent) {
    if (child) {
        var currParent = child.parentElement;
        while (currParent.className != targetParent && currParent.className !== null) {
            currParent = currParent.parentElement;
        }
        return currParent;
    }
};


var getSongItem = function (element) {
    switch (element.className) {
    case 'album-song-button':
    case 'ion-play':
    case 'ion-pause':
        return findParentByClassName(element, 'song-item-number');
    case 'album-view-song-item':
        return element.querySelector('.song-item-number');
    case 'song-item-title':
    case 'song-item-duration':
        return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
    case 'song-item-number':
        return element;
    default:
        return;
    }
};

var clickHandler = function (targetElement) {
    var songItem = getSongItem(targetElement);
    if (currentlyPlayingSong === null) { //if no song
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) { //if the playing song is cliked again
        songItem.innerHTML = playButtonTemplate;
        currentlyPlayingSong = null;
    } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) { //if the cliked song is not the active song
        var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
        currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    }
};

//get the song list container
var songListContainer = document.getElementsByClassName('album-view-song-list')[0];

//get the song rows
var songRows = document.getElementsByClassName('album-view-song-item');

//play button
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';

//pause button
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

// Store state of playing songs
var currentlyPlayingSong = null;

window.onload = function () {
    //current album
    setCurrentAlbum(albumPicasso);

    //add hover effect to parent element
    //Event Delegation
    songListContainer.addEventListener('mouseover', function (event) {

        if (event.target.parentElement.className === 'album-view-song-item') {

            var songItem = getSongItem(event.target);

            if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
                songItem.innerHTML = playButtonTemplate;
            }

        }

    });

    //rever back to number when mouse leaving
    for (var i = 0; i < songRows.length; i++) {

        songRows[i].addEventListener('mouseleave', function (event) {
            var songItem = getSongItem(event.target);
            var songItemNumber = songItem.getAttribute('data-song-number');

            if (songItemNumber !== currentlyPlayingSong) {
                songItem.innerHTML = songItemNumber;
            }
        });

        songRows[i].addEventListener('click', function (event) {
            // Event handler call
            clickHandler(event.target);
        });
    }
};