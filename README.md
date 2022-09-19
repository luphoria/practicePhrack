# practicePhrack
A simple webpage allowing you to practice with layered audio tracks.

## WARNING WARNING WARNING
This software is [shitty](https://xkcd.com/1926/). I made this in a few hours, and it was good enough for my use case; so, I finished, pushed the product, and then started writing some basic documentation.

Particularly notably, you will NEED to use this as a local file - NOT served over HTTP. If you serve this over HTTP, your browser will get confused trying to get the timestamps in the audio file it hasn't yet loaded.

## Structure
 - Add a folder for each song in the `tracks` folder.
 - In this folder, upload any part layers.
 - With this setup, enter `index.js` and edit TRACKS to include the following for your new song:

```
  Song_Title: {
    title: "Formatted title",
    prefix: "Directory_in_tracks/",
    main: "SONG.MP3",
    S1: "SOPRANO TRACK 1.MP3",
    S2: "SOPRANO TRACK 2.MP3",
    A1: "ALTO TRACK 1.MP3",
    A2: "ALTO TRACK 2.MP3",
    T1: "TENOR TRACK 1.MP3",
    T2: "TENOR TRACK 2.MP3",
    B1: "BASS TRACK 1.MP3",
    B2: "BASS TRACK 2.MP3",
    extra: {
      any_extra_track: "path/to/that/track.mp3"
    },
    checkpoints: {
      1: 0,
      [measure number]: [time in seconds to offset song playback]
    }
  }
```

## Why
I like singing in a choir. Particularly, I like auditioning for highly competitive choruses. Particularly, the [IHSMA All-State Music Festival](https://ihsma.org/all-state-music-festival/) stands out as the motivation for this software.

One common method for practicing at such competitive levels is utilizing part-based practice tracks. However, the user experience while doing this is severely lacking: You are just given around 15 files per song. One balanced, each voice part dominant, each voice part muted. 

This tool attempts to make it easier to navigate, and would be especially applicable for a choir teacher giving resources to students.

*~ luphoria*