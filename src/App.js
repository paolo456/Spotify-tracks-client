import logo from './logo.svg';
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery'
import SpotifyWebApi from 'spotify-web-api-js';
import './App.css';
const spotifyApi = new SpotifyWebApi();


class App extends React.Component {
	constructor(){
	  super();
	  const params = this.getHashParams();
	  const token = params.access_token
	  if (token) {
		  spotifyApi.setAccessToken(token)
	  }
	  this.state = {
		albumImg: [],
		date: null,
		focused: Boolean,
		songs: new Map(),
		token: token,
		loggedIn: token ? true : false,
		nowPlaying: { name: 'Not Checked', albumArt: ''}
	  }
	}
	getHashParams() {
	  var hashParams = {};
	  var e, r = /([^&;=]+)=?([^&;]*)/g,
		  q = window.location.hash.substring(1);
	  e = r.exec(q)
	  while (e) {
		 hashParams[e[1]] = decodeURIComponent(e[2]);
		 e = r.exec(q);
	  }
	  return hashParams;
	}
	getNowPlaying(){
		spotifyApi.getMyCurrentPlaybackState()
		  .then((response) => {
			this.setState({
			  nowPlaying: { 
				  name: response.item.name, 
				  albumArt: response.item.album.images[0].url
				}
			});
		  })
	  }
	getTime(time) {
		switch(time) {
			case 'month':
				return '?time_range=short_term'
			case 'six-months':
				return '?time_range=medium_term';
			case 'all-time':
				return '?time_range=long_term';
		  }
	}
	async topSongs(){
		let date = this.state.date
		//console.log(date.valueOf())
		let token = this.state.token
		let request = await fetch('https://api.spotify.com/v1/me/player/recently-played', {
			headers: { Authorization: 'Bearer ' + token },
		  })
		let json = await request.json();
		let tempMap = new Map()
		let tempImg = []
		console.log(json.items)
		
		for (let i = 0; i < json.items.length; i++) {
			tempMap.set(json.items[i].popularity, json.items[i].name)
			//tempImg.push(json.items[i].album.images[0])

		}
		this.setState({
			albumImg: tempImg
		})
		console.log(this.state.albumImg)
		console.log(tempMap.values())
		
		}
	render() {
	const albums = this.state.albumImg.map((images) => {
		return (
			<div>
				<img src={images.url}></img>
			</div>
		)
	})
	return (
	<div className="App">
		<a href='https://spotify-db-app.herokuapp.com/login' > Login to Spotify </a>
		<div>
			Now Playing: {this.state.nowPlaying.name}
		</div>
		<div>
			<img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
		</div>
		{ this.state.loggedIn &&
	<button onClick={() => this.topSongs()}>
		Check Now Playing
	</button>
	}
		<div>
			
		</div>
	
	</div>
	);
	
	}
  }

export default App;
