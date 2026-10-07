/* =========================================================
   SHARED SPOTIFY API
========================================================= */

const SPOTIFY_CLIENT_ID =
    "fae13fa2e07742fe965dc432cd6de43d";

const SPOTIFY_REDIRECT_URI =
    "https://crocenjoyer.github.io/Info/spotify.html";

const SPOTIFY_SCOPES = [
    "user-read-private",
    "user-read-email",
    "user-read-currently-playing",
    "user-read-playback-state",
    "user-read-recently-played",
    "user-top-read"
];


/* =========================================================
   PKCE
========================================================= */

function spotifyRandomString(length) {

    const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    const values =
        crypto.getRandomValues(
            new Uint8Array(length)
        );

    return values.reduce(
        (text, value) =>
            text + possible[value % possible.length],
        ""
    );
}


async function spotifySHA256(value) {

    const data =
        new TextEncoder().encode(value);

    return crypto.subtle.digest(
        "SHA-256",
        data
    );
}


function spotifyBase64URL(input) {

    return btoa(
        String.fromCharCode(
            ...new Uint8Array(input)
        )
    )
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}


/* =========================================================
   LOGIN
========================================================= */

async function spotifyLogin() {

    const verifier =
        spotifyRandomString(64);

    const challenge =
        spotifyBase64URL(
            await spotifySHA256(verifier)
        );


    localStorage.setItem(
        "spotify_code_verifier",
        verifier
    );


    const params =
        new URLSearchParams({
            client_id: SPOTIFY_CLIENT_ID,
            response_type: "code",
            redirect_uri: SPOTIFY_REDIRECT_URI,
            scope: SPOTIFY_SCOPES.join(" "),
            code_challenge_method: "S256",
            code_challenge: challenge
        });


    window.location.href =
        "https://accounts.spotify.com/authorize?" +
        params.toString();
}


/* =========================================================
   TOKENS
========================================================= */

function spotifySaveTokens(data) {

    localStorage.setItem(
        "spotify_access_token",
        data.access_token
    );


    if (data.refresh_token) {

        localStorage.setItem(
            "spotify_refresh_token",
            data.refresh_token
        );

    }


    localStorage.setItem(
        "spotify_token_expires",
        Date.now() +
        data.expires_in * 1000
    );
}


async function spotifyExchangeCode(code) {

    const verifier =
        localStorage.getItem(
            "spotify_code_verifier"
        );


    if (!verifier) {

        throw new Error(
            "Spotify code verifier missing."
        );

    }


    const body =
        new URLSearchParams({
            client_id: SPOTIFY_CLIENT_ID,
            grant_type: "authorization_code",
            code: code,
            redirect_uri: SPOTIFY_REDIRECT_URI,
            code_verifier: verifier
        });


    const response =
        await fetch(
            "https://accounts.spotify.com/api/token",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                },

                body: body
            }
        );


    if (!response.ok) {

        throw new Error(
            "Spotify login failed."
        );

    }


    const data =
        await response.json();


    spotifySaveTokens(data);


    localStorage.removeItem(
        "spotify_code_verifier"
    );


    return data.access_token;
}


async function spotifyRefreshToken() {

    const refreshToken =
        localStorage.getItem(
            "spotify_refresh_token"
        );


    if (!refreshToken) {

        return null;

    }


    const body =
        new URLSearchParams({
            client_id: SPOTIFY_CLIENT_ID,
            grant_type: "refresh_token",
            refresh_token: refreshToken
        });


    const response =
        await fetch(
            "https://accounts.spotify.com/api/token",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                },

                body: body
            }
        );


    if (!response.ok) {

        return null;

    }


    const data =
        await response.json();


    spotifySaveTokens(data);


    return data.access_token;
}


async function spotifyGetToken() {

    const token =
        localStorage.getItem(
            "spotify_access_token"
        );


    const expiry =
        Number(
            localStorage.getItem(
                "spotify_token_expires"
            )
        );


    if (
        token &&
        expiry &&
        Date.now() < expiry - 60000
    ) {

        return token;

    }


    return spotifyRefreshToken();
}


/* =========================================================
   API REQUEST
========================================================= */

async function spotifyAPI(endpoint) {

    let token =
        await spotifyGetToken();


    if (!token) {

        throw new Error(
            "Spotify is not connected."
        );

    }


    let response =
        await fetch(
            "https://api.spotify.com/v1" +
            endpoint,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


    if (response.status === 401) {

        token =
            await spotifyRefreshToken();


        if (!token) {

            throw new Error(
                "Spotify session expired."
            );

        }


        response =
            await fetch(
                "https://api.spotify.com/v1" +
                endpoint,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

    }


    return response;
}


/* =========================================================
   LISTENING HISTORY
========================================================= */

function spotifySaveListeningHistory(items) {

    const history =
        JSON.parse(
            localStorage.getItem(
                "spotifyListeningHistory"
            )
        ) || {};


    items.forEach(
        function(item) {

            const id =
                item.played_at;


            if (!history[id]) {

                history[id] = {

                    duration:
                        item.track.duration_ms,

                    track:
                        item.track.name,

                    artist:
                        item.track.artists
                            .map(
                                artist =>
                                    artist.name
                            )
                            .join(", "),

                    playedAt:
                        item.played_at,

                    image:
                        item.track.album
                            .images?.[0]?.url || "",

                    spotifyUrl:
                        item.track.external_urls
                            .spotify || ""

                };

            }

        }
    );


    localStorage.setItem(
        "spotifyListeningHistory",
        JSON.stringify(history)
    );


    return history;
}


/* =========================================================
   LATEST TRACK
========================================================= */

async function spotifyGetLatestTrack() {

    const response =
        await spotifyAPI(
            "/me/player/recently-played?limit=50"
        );


    if (!response.ok) {

        throw new Error(
            "Could not load recent Spotify tracks."
        );

    }


    const data =
        await response.json();


    if (!data.items.length) {

        return null;

    }


    spotifySaveListeningHistory(
        data.items
    );


    const latest =
        data.items[0];


    return {

        track:
            latest.track.name,

        artist:
            latest.track.artists
                .map(
                    artist =>
                        artist.name
                )
                .join(", "),

        image:
            latest.track.album
                .images?.[0]?.url || "",

        playedAt:
            latest.played_at,

        spotifyUrl:
            latest.track.external_urls
                .spotify || ""

    };

}
/* =========================================================
   CURRENTLY PLAYING
========================================================= */

async function spotifyGetCurrentTrack() {

    const response =
        await spotifyAPI(
            "/me/player/currently-playing"
        );


    if (
        response.status === 204 ||
        !response.ok
    ) {

        return null;

    }


    const data =
        await response.json();


    if (
        !data.item ||
        !data.is_playing
    ) {

        return null;

    }


    const track =
        data.item;


    return {

        track:
            track.name,

        artist:
            track.artists
                .map(
                    artist =>
                        artist.name
                )
                .join(", "),

        image:
            track.album
                .images?.[0]?.url || "",

        spotifyUrl:
            track.external_urls
                .spotify || "",

        isPlaying:
            true

    };

}
