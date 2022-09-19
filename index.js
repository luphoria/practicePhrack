const TRACKS = {
  /*
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
      MEASURENUMBER: SECONDSINTOSONG
    }
  }
  */
  SAMPLE_SONG: {
    title: "Sample Song #1",
    prefix: "SAMPLE_SONG",
    main: "SAMPLE_SONG.mp3",
    S1: "SAMPLE_SONG-S.mp3",
    S2: "SAMPLE_SONG-S.mp3",
    A1: "SAMPLE_SONG-A.mp3",
    A2: "SAMPLE_SONG-A.mp3",
    T1: "SAMPLE_SONG-T.mp3",
    T2: "SAMPLE_SONG-T.mp3",
    B1: "SAMPLE_SONG-B.mp3",
    B2: "SAMPLE_SONG-B.mp3",
    extra: {},
    checkpoints: {
      1: 0,
    },
  },
  SAMPLE_SONG2: {
    title: "Sample Song #2",
    prefix: "SAMPLE_SONG2",
    main: "SAMPLE_SONG2.mp3",
    S1: "SAMPLE_SONG2-S1.mp3",
    S2: "SAMPLE_SONG2-S2.mp3",
    A1: "SAMPLE_SONG2-A1.mp3",
    A2: "SAMPLE_SONG2-A2.mp3",
    T1: "SAMPLE_SONG2-T1.mp3",
    T2: "SAMPLE_SONG2-T2.mp3",
    B1: "SAMPLE_SONG2-B1.mp3",
    B2: "SAMPLE_SONG2-B2.mp3",
    extra: {
      piano: "SAMPLE_SONG2-Piano.mp3",
    },
    checkpoints: {
      1: 0,
      14: 44,
      37: 85,
      58: 121,
      109: 210,
    },
  },
};

let NOW_ACTIVE = {
  playing: false,           // Whether it is paused or playing
  bin: [],                  // Any audio tracks currently in use
  track: null,              // Name of the track
  part: null,               // What part specified
  part_play: "predominant", // Whether the part specified is dominant or submissive
};

const create_audio = (track_title, track_variant) => {
  // Creates the new Audio() track.
  // TODO - totally rework this, so that it preloads all 
  // audio tracks to avoid lag when using a server to 
  // serve the file contents.
  track_variant = track_variant ? track_variant : "main"; // What part was specified?
  NOW_ACTIVE.bin.push( // create the Audio instance
    new Audio(
      `./tracks/${TRACKS[track_title].prefix}/${TRACKS[track_title][track_variant]}`
    )
  );
  NOW_ACTIVE.bin[NOW_ACTIVE.bin.length - 1].currentTime = // set the start time of the track
    TRACKS[track_title].checkpoints[
      document.getElementById("start-pos").value || "1"
    ];
  return NOW_ACTIVE.bin[NOW_ACTIVE.bin.length - 1];
};

const create_audio_muted = (track_title, track_variant) => { // Submissive/muted track
  if (!track_variant) return create_audio(track_title);
  // We want to cut out both the first and second voice parts of 
  // whichever was specified. i.e. B1 should cut B1 AND B2
  track_variant = [ 
    track_variant.slice(0, 1) + "1",
    track_variant.slice(0, 1) + "2",
  ];
  let tracks = ["S1", "S2", "A1", "A2", "T1", "T2", "B1", "B2"];
  tracks = tracks.filter((item) => !track_variant.includes(item)); // remove the specified tracks
  tracks.forEach((track) => {
    create_audio(track_title, track);
  });
  NOW_ACTIVE.playing = true;
  NOW_ACTIVE.bin.forEach((audio) => { // start all audio tracks at once
    return audio.play();
  });
  return NOW_ACTIVE.bin;
};

const stop = () => { // Stop playback
  NOW_ACTIVE.bin.forEach((audio) => {
    return audio.pause();
  });
  NOW_ACTIVE = { // default values
    playing: false,
    bin: [],
    track: null,
    part: null,
    part_play: "predominant",
  };
};

const start = (track_title, track_variant, part_play) => {
  NOW_ACTIVE.bin.forEach((audio) => { // Stop current playback
    audio.pause();
  });
  NOW_ACTIVE.bin = [];
  NOW_ACTIVE.track = track_title;
  NOW_ACTIVE.part = track_variant;
  NOW_ACTIVE.playing = true;
  // part_play is a bool. At false, it is Predominant. At true, it is Muted
  if (part_play ? "muted" : "predominant" == "muted") {
    NOW_ACTIVE.part_play = "muted";
    return create_audio_muted(track_title, track_variant);
  }
  return create_audio(track_title, track_variant).play();
};

window.onload = () => {
  Object.keys(TRACKS).forEach((track) => {
    // Populate the available tracks
    let track_opt = document.createElement("option");
    track_opt.setAttribute("value", track);
    track_opt.innerText = TRACKS[track].title;
    document.getElementById("track").appendChild(track_opt);
  });
  document.getElementById("track").addEventListener("change", () => {
    // When a track is selected
    document.getElementById("start-pos").innerHTML = ""; // wipe current start positions
    Object.keys(
      TRACKS[document.getElementById("track").value].checkpoints
    ).forEach((checkpoint) => {
      // repopulate start-positions
      let startpos_opt = document.createElement("option");
      startpos_opt.setAttribute("value", checkpoint);
      startpos_opt.innerText = checkpoint;
      document.getElementById("start-pos").appendChild(startpos_opt);
    });
  });

  // PARTIAL broken code for preloading the audio tracks.

  // Object.keys(TRACKS).forEach((track) => {
  //   ["main", "S1", "S2", "A1", "A2", "T1", "T2", "B1", "B2"].forEach((part) => {
  //     let audio = document.createElement("audio");
  //     audio.setAttribute("id", track + "_" + part);
  //     audio.setAttribute("preload", "auto");
  //     let source = document.createElement("source");
  //     source.setAttribute(
  //       "src",
  //       "tracks/" + TRACKS[track]["prefix"] + "/" + TRACKS[track][part]
  //     );
  //     audio.appendChild(source);
  //     document.body.appendChild(audio);
  //   });
  // });
};
