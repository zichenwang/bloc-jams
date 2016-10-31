var setSong = function (songNumber) {
    if (currentSoundFile) {
        currentSoundFile.stop();
    }

    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {

        formats: ['mp3'],
        preload: true
    });

    setVolume(currentVolume);
};

var getSongNumberCell = function (number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var seek = function (time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
}

var setVolume = function (volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
};

var createSongRow = function (songNumber, songName, songLength) {
    songLength = filterTimeCode(songLength);
    var template =
        '<tr class="album-view-song-item">' + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' + '  <td class="song-item-title">' + songName + '</td>' + '  <td class="song-item-duration">' + songLength + '</td>' + '</tr>';

    var $row = $(template);

    var clickHandler = function () {
        var songNumber = parseInt($(this).attr('data-song-number'));

        if (currentlyPlayingSongNumber !== null) {
            // Revert to song number for currently playing song because user started playing new song.
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }

        if (currentlyPlayingSongNumber !== songNumber) {
            // Switch from Play -> Pause button to indicate new song is playing.
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            currentSoundFile.play();

            //set volume to default
            var $volumeFill = $('.volume .fill');
            var $volumeThumb = $('.volume .thumb');
            $volumeFill.width(currentVolume + '%');
            $volumeThumb.css({
                left: currentVolume + '%'
            });

            updatePlayerBarSong();
        } else if (currentlyPlayingSongNumber === songNumber) {
            // Switch from Pause -> Play button to pause currently playing song.
            if (currentSoundFile.isPaused()) {
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
            } else {
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();
            }
        }

        updateSeekBarWhileSongPlays();

    };

    var onHover = function (event) {
        var songItemNumberElem = $(this).find('.song-item-number');

        var songNumber = parseInt(songItemNumberElem.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songItemNumberElem.html(playButtonTemplate);
        }

    };

    var offHover = function (event) {
        var songItemNumberElem = $(this).find('.song-item-number');

        var songNumber = parseInt(songItemNumberElem.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songItemNumberElem.html(songNumber);
        }

    };

    //add listeners
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);

    return $row;
};

var setCurrentAlbum = function (album) {
    currentAlbum = album;
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

var setTotalTimeInPlayerBar = function (totalTime) {
    var timer = buzz.toTimer(totalTime);
    $('.total-time').text(timer);
};

var setCurrentTimeInPlayerBar = function (currentTime) {
    var timer = buzz.toTimer(currentTime);
    $('.current-time').text(timer);
};

var filterTimeCode = function (timeInSeconds) {
    var timeInSec = parseFloat(timeInSeconds);

    var minutes = Math.floor(timeInSec / 60);
    var seconds = Math.floor(timeInSec % 60);

    return minutes + ":" + seconds;
};


var updateSeekBarWhileSongPlays = function () {
    if (currentSoundFile) {

        currentSoundFile.bind('timeupdate', function (event) {
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');

            updateSeekPercentage($seekBar, seekBarFillRatio);

            setCurrentTimeInPlayerBar(this.getTime());
        });
    }
};

var updateSeekPercentage = function ($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    // offset [0. 100]
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);

    // set css
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({
        left: percentageString
    });
};

var setupSeekBars = function () {
    var $seekBars = $('.player-bar .seek-bar');

    $seekBars.click(function (event) {
        // get offset
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();

        // get ratio
        var seekBarFillRatio = offsetX / barWidth;

        //update song time
        if ($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);
        }

        updateSeekPercentage($(this), seekBarFillRatio);
    });

    $seekBars.find('.thumb').mousedown(function (event) {
        // this is .thumb
        var $seekBar = $(this).parent();

        // namespace event listners
        $(document).bind('mousemove.thumb', function (event) {
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;

            if ($(this).parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());
            } else {
                setVolume(seekBarFillRatio * 100);
            }

            updateSeekPercentage($seekBar, seekBarFillRatio);
        });

        // unbind mousemove and up
        $(document).bind('mouseup.thumb', function () {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
    });
};

//return the index
var trackIndex = function (album, song) {
    return album.songs.indexOf(song);
};

var nextSong = function () {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);

    updateSeekBarWhileSongPlays()

    var newSongIndex = currentSongIndex;

    if (newSongIndex >= currentAlbum.songs.length - 1) {
        newSongIndex = 0;
    } else {
        newSongIndex++;
    }

    //Set a new current song
    setSong(newSongIndex + 1);

    //play the song
    currentSoundFile.play();

    //Update the player bar
    updatePlayerBarSong();

    //Update the HTML of the previous song's .song-item-number element with a number.
    currentSongIndex++;

    var $lastSongNumberCell = getSongNumberCell(currentSongIndex);

    $lastSongNumberCell.html(currentSongIndex);

    //Update the HTML of the new song's .song-item-number element with a pause button.
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);

    $nextSongNumberCell.html(pauseButtonTemplate);

    updateSeekBarWhileSongPlays();
};

var previousSong = function () {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);

    var preSongIndex = currentSongIndex;
    console.log(preSongIndex);

    if (preSongIndex <= 0) {
        preSongIndex = currentAlbum.songs.length - 1;
    } else {
        preSongIndex--;
    }

    //Set a new current song
    setSong(preSongIndex + 1);

    //play the song
    currentSoundFile.play();

    //Update the player bar
    updatePlayerBarSong();

    //Update the HTML of the previous song's .song-item-number element with a number.
    currentSongIndex++;
    var $lastSongNumberCell = getSongNumberCell(currentSongIndex);

    $lastSongNumberCell.html(currentSongIndex);

    //Update the HTML of the new song's .song-item-number element with a pause button.
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);

    $nextSongNumberCell.html(pauseButtonTemplate);

    updateSeekBarWhileSongPlays();
};

var togglePlayFromPlayerBar = function () {
    var $currentCell = getSongNumberCell(currentlyPlayingSongNumber);
    if (currentSoundFile.isPaused()) {
        $currentCell.html(pauseButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPauseButton);
        currentSoundFile.play();
    } else if (currentSoundFile) {
        $currentCell.html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
        currentSoundFile.pause();
    }

};

var updatePlayerBarSong = function () {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);

    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);

    $('.main-controls .play-pause').html(playerBarPauseButton);
    setTotalTimeInPlayerBar(currentSongFromAlbum.duration);
};

//play button
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';

//pause button
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

//play and pause button for the play bar
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

// Store state of playing songs
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPauseBtn = $('.main-controls .play-pause');

$(document).ready(function () {
    //current album
    setCurrentAlbum(albumPicasso);
    setupSeekBars();

    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $playPauseBtn.click(togglePlayFromPlayerBar);

});