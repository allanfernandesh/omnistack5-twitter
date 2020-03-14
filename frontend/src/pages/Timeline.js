import React, { Component } from 'react';
import api from '../services/api'
import socket from 'socket.io-client'

import TwitterLogo from '../imgs/twitter.svg';
import './Timeline.css';

import Tweet from '../components/Tweet'


export default class Timeline extends Component {
  state = {
    tweets: [],
    newTweet: ""
  }

  subcribeToEvents = () => {
    const io = socket('http://localhost:3000')

    io.on('tweet', data => {

      this.setState({ tweets: [data,...this.state.tweets]})
      
      })

    io.on('like', data => {
      this.setState({ tweets: this.state.tweets.map(tweet => 
        tweet._id === data._id ? data : tweet
      ) })
    })
  }

   async componentDidMount() {
    this.subcribeToEvents()

     const response = await api.get('tweets')

     this.setState({ tweets: response.data })
   }

  handleInputChange = e => {
    this.setState({ newTweet: e.target.value })
  }

  handleNewTweet =  async e => {
    if (e.keyCode !== 13) return

    const content = this.state.newTweet
    const author = localStorage.getItem('@GoTwitter:username')

      await api.post('tweets', { content, author })

    console.log(content, author)
    this.setState({ newTweet:"" })
  } 

  render() {
    return (
      <div className="timeline-wrapper">
        <img height={24} src={TwitterLogo} alt="GoTwitter" />

        <form>
          <textarea
            value={this.state.newTweet}
            onChange={this.handleInputChange}
            onKeyDown={this.handleNewTweet}
            placeholder="O que está acontecendo?" 
            />
        </form>
        <ul className="tweet-list">
          { this.state.tweets.map(tweet => 
            <Tweet key={ tweet._id } tweet={ tweet }/> )}
        </ul>
      </div>
    );
  }
}
