import React from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import Spotify from "../../util/Spotify";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: "New Playlist",
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    const doesPlaylistContainTrack = tracks.find(
      savedTrack => savedTrack.id === track.id
    );

    if (doesPlaylistContainTrack) {
      return;
    }

    tracks.push(track);

    this.setState({
      playlistTracks: tracks
    });
  }

  removeTrack(track) {
    const tracks = this.state.playlistTracks.filter(
      savedTrack => savedTrack.id !== track.id
    );

    this.setState({
      playlistTracks: tracks
    });
  }

  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    });
  }

  async search(term) {
    const response = await Spotify.search(term);
    const jsonResponse = await response.json();
    const tracks = jsonResponse.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri
    }));

    this.setState({
      searchResults: tracks
    });
  }

  async savePlaylist() {
    // Generate URIs in array
    const playlistURIs = this.state.playlistTracks.map(track => track.uri);

    // Send to Spotify to save to list
    await Spotify.savePlaylist(this.state.playlistName, playlistURIs);

    this.setState({
      playlistName: "New Playlist",
      playlistTracks: []
    });
  }

  render() {
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              onAdd={this.addTrack}
              searchResults={this.state.searchResults}
            />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
