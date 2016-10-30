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

    var $row = $(template);

    var clickHandler = function () {
        var songNumber = $(this).attr('data-song-number');

        if (currentlyPlayingSong !== null) {
            // Revert to song number for currently playing song because user started playing new song.
            var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSong + '"]');
            currentlyPlayingCell.html(currentlyPlayingSong);
        }

        if (currentlyPlayingSong !== songNumber) {
            // Switch from Play -> Pause button to indicate new song is playing.
            $(this).html(pauseButtonTemplate);
            currentlyPlayingSong = songNumber;
        } else if (currentlyPlayingSong === songNumber) {
            // Switch from Pause -> Play button to pause currently playing song.
            $(this).html(playButtonTemplate);
            currentlyPlayingSong = null;
        }

    };

    var onHover = function (event) {
        var songItemNumberElem = $(this).find('.song-item-number');

        var songNumber = songItemNumberElem.attr('data-song-number');

        if (songNumber !== currentlyPlayingSong) {
            songItemNumberElem.html(playButtonTemplate);
        }

    };

    var offHover = function (event) {
        var songItemNumberElem = $(this).find('.song-item-number');

        var songNumber = songItemNumberElem.attr('data-song-number');

        if (songNumber !== currentlyPlayingSong) {
            songItemNumberElem.html(songNumber);
        }

    };

    //add listeners
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);

    return $row;
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

//play button
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';

//pause button
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

// Store state of playing songs
var currentlyPlayingSong = null;

$(document).ready(function () {
    //current album
    setCurrentAlbum(albumPicasso);

});