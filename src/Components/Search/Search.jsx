import axios from "axios";
import React, {useEffect, useState} from "react";

const Search = () => {

    let access_token = window.localStorage.getItem("access_token");
    const [search, setSearch] = useState(undefined);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTracks, setsearchTracks] = useState(null);
    const [searchAlbums, setSearchAlbums] = useState(null);
    const [searchPlaylist, setSearchPlaylist] = useState(null);
    const [searchArtists, setSearchArtists] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!search) return setSearchResults([])
        if (!access_token) return

        let cancel = false;
        const apiUrl = "https://api.spotify.com/v1";
        const SEARCH = `${apiUrl}/search?q=${search}&type=track%2Cartist%2Calbum%2Cplaylist`;

        axios
            .get(SEARCH, {
                headers: {
                    Authorization: "Bearer " + access_token,
                    "Content-Type": "application/json",
                },
                params: {
                    limit: "2"
                },

            })
            .then(res => {

                setsearchTracks(
                    res.data['tracks'].items.map(track => {
                    return {
                        title: track.name,
                        image: track.album.images[0].url,
                        artists: (track.artists.map(artist => {return artist.name })).join(','),
                        uri: track.uri
                    };
                }))

                setSearchAlbums(
                    res.data['albums'].items.map(album => {
                        return {
                            id: album.id,
                            title: album.name,
                            image: album.images[0].url,
                            artists: (album.artists.map(artist => {return artist.name })).join(','),
                            uri: album.uri
                        }
                    })
                )

                setSearchArtists(
                    res.data['artists'].items.map(artist => {
                        return {
                            id: artist.id,
                            name: artist.name,
                            image: artist.images[0].url,
                            uri: artist.uri
                        }
                    })
                )

                setSearchPlaylist(
                    res.data['playlists'].items.map(playlist => {
                        return {
                            id: playlist.id,
                            title: playlist.name,
                            image: playlist.images[0].url,
                            owner: playlist.owner.display_name,
                            uri: playlist.uri
                        }
                    })
                )

            })
            .catch((e) => console.log(e.response));


        return () => (cancel = true)
    }, [search, access_token])


    
    return(
        <div>
            <div style={{textAlign: 'center'}}>

                <label>
                    <input style={{width: '90%', fontSize: '30px'}}
                           type="text" placeholder='Search' value={search} onChange={e => setSearch(e.target.value)} />
                </label>
            </div>

            <div id='tracks-result'>
                {searchTracks && <h2>Tracks</h2>}
                {searchTracks && searchTracks.map(track => {
                    return (
                        <div style={{ display: 'flex' }}>

                            <img src={track.image} style={{ height: "64px", width: "64px" }} />
                            <div>
                                <div>{track.title}</div>
                                <div className="text-muted">{track.artists}</div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div id='albums-result'>
                {searchAlbums && <h2>Albums</h2>}
                {searchAlbums && searchAlbums.map(album => {
                    return (
                        <div style={{ display: 'flex' }}>

                            <a href={`/album?id=${album.id}`}>
                                <img src={album.image} style={{ height: "64px", width: "64px" }} />
                                <div>
                                    <div>{album.title}</div>
                                    <div className="text-muted">{album.artists}</div>
                                </div>
                            </a>
                        </div>
                    )
                })}
            </div>

            <div id='artists-result'>
                {searchArtists && <h2>Artists</h2>}
                {searchArtists && searchArtists.map(artist => {
                    return (
                        <div style={{ display: 'flex' }}>

                            <a href={`/artist?id=${artist.id}`} >
                            <img src={artist.image} style={{ height: "64px", width: "64px" }} />
                            <div>
                                <div>{artist.name}</div>
                            </div>
                            </a>
                        </div>
                    )
                })}
            </div>

            <div id='playlist-result'>
                {searchPlaylist && <h2>Playlists</h2>}
                {searchPlaylist && searchPlaylist.map(playlist => {
                    return (
                        <div style={{ display: 'flex' }}>

                            <a href={`/playlist?id=${playlist.id}`} >
                                <img src={playlist.image} style={{ height: "64px", width: "64px" }} />
                                <div>
                                    <div>{playlist.title}</div>
                                    <div className="text-muted">{playlist.owner}</div>
                                </div>
                            </a>

                        </div>
                    )
                })}
            </div>


        </div>
    )
}

export default Search;