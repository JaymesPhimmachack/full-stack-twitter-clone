import React from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';

import { authenticate, getTweets, postTweet, logoutUser, deleteTweet } from './requests/requests';

import 'bootstrap/dist/css/bootstrap';
import './dashboard.scss';


class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'undefined',
      tweetCount: 0,
      charLength: 140,
      remainChar: 140,
      postLength: 1
    };

    this.handleBrandClick = this.handleBrandClick.bind(this);
    this.handleDeleteTweet = this.handleDeleteTweet.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleInputKeyUp = this.handleInputKeyUp.bind(this);
    this.handlePostTweet = this.handlePostTweet.bind(this);
  }

  componentDidMount() {
    authenticate()
      .then(response => {
        if (response.authenticated) {
          let currentUser = response.username;
          this.setState({ username: currentUser });
          this.getTweetsAndPost();
          getTweets()
            .then(response => {
              this.setState({ tweetCount: response.tweets.length })
            })
            .catch(error => console.log(error));
        }
        else {
          window.location.replace("/");
        }
      })
      .catch(error => console.log(error));
  }

  handleInputKeyUp(e) {
    let post = e.target.value;
    let postLength = post.length;
    let charLength = this.state.charLength;
    let charCount = charLength - postLength;

    this.setState({ remainChar: charCount })
    this.setState({ post: post })
    let remainChar = this.state.remainChar;

    if (remainChar > 0 && remainChar <= 140) {
      e.target.nextSibling.childNodes[0].removeAttribute('disabled');
    }
    else {
      e.target.nextSibling.childNodes[0].setAttribute('disabled', 'disabled');
    }
  };

  handlePostTweet(e) {
    let post = this.state.post;

    e.preventDefault();
    postTweet(post)
      .then(response => {
        if (response.success) {

          let postInput = this.refs.postInput;
          postInput.value = '';
          this.setState({ remainChar: 140 })

          getTweets()
            .then(response => {
              console.log(response)
              this.setState({ tweetCount: response.tweets.length })
            })
            .catch(error => console.log(error));
          this.getTweetsAndPost();
        }
      })
      .catch(error => console.log(error));

  };

  handleLogout() {
    logoutUser()
      .then(() => {
        authenticate()
          .then(response => {
            if (!response.authenticated) {
              window.location.replace("/");
            }
          })
          .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
  };

  getTweetsAndPost() {
    let tweetList = document.querySelector('#tweets'),
      tweets = tweetList.childNodes;

    if (tweets.length > 0) {
      tweetList.innerHTML = '';
    }

    getTweets()
      .then(response => {
        var html = '';

        response.tweets.forEach(tweet => {
          html += `<div class="tweet border border-info p-2 bg-white">
               <div><span class="username mr-5">${tweet.username}</span><span class="screenName">@${tweet.username}</span></div>
               <div class="d-flex justify-content-between mt-3">
                 <span class="post">${tweet.message}</span><a class="delete-tweet" id="${tweet.id}" href="#">Delete Tweet</a>
               </div>
             </div>`;
        });
        tweetList.innerHTML = html;
      })
      .catch(error => console.log(error));
  }

  handleBrandClick() {
    this.getTweetsAndPost();
  };

  handleDeleteTweet(e) {
    let className = e.target.className;
    e.preventDefault();

    if (className === 'delete-tweet') {
      let id = e.target.id;

      deleteTweet(id)
        .then(() => {
          getTweets()
            .then(response => {
              this.setState({ tweetCount: response.tweets.length })
            })
            .catch(error => console.log(error));

          this.getTweetsAndPost();
        })
        .catch(error => console.log(error));
    }
  };

  render() {
    return (
      <div ref="dashboard" className="container">
      <nav  className="navbar navbar-expand-lg navbar-light bg-light mb-5">
  
      <ul  className="navbar-nav mr-auto">
        <li  className="nav-item active">
          <a  className="nav-link" href="#">Home <span  className="sr-only">(current)</span></a>
        </li>
        <li  className="nav-item">
          <a className="nav-link" href="#">Notifications</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Messages</a>
        </li>
      </ul>  
      <a className="navbar-brand" href="#"><FontAwesomeIcon icon={faTwitter} color="#1ea1f2" /></a>
      <form className="form-inline my-2 my-lg-0">
        <input className="form-control mr-sm-2" type="search" placeholder="Search Twitter" aria-label="Search" />
        <button className="search-btn my-2 my-sm-0" type="submit">Search</button>
      </form>
      <div>
        <a className="nav-link" href="#" id="username"></a>
        <a className="nav-link" href="#" onClick={this.handleLogout}>Log Out</a>
      </div>
      </nav>
      <div  className="row">
        <div  className="col-xs-12 col-md-4">
          <div className="mb-5 mt-3">
            <div className="user p-2">
            <p className="username">{this.state.username}</p>
            <p className="screenName">{'@' + this.state.username}</p>
            </div>
            <div className="bg-white p-2">
              <div className="d-inline-block mr-2">
                <p>Tweets</p>
                <p>{this.state.tweetCount}</p>
              </div>
              <div className="d-inline-block mr-2">
                <p>Following</p>
                <p>0</p>
              </div>
              <div className="d-inline-block">
                <p>Follower</p>
                <p>0</p>
                </div>
            </div>
          </div>
          <div className="p-2 bg-white">
            <p>Trends for you</p>
            <p>#Ruby</p>
            <p>#API</p>
            <p>#JavaScript</p>
            <p>#Fullstack</p>
          </div>
        <div>
      </div>
      </div> 
      <div className="col-xs-12 col-md-8">
        <div className="mt-3">
          <div>
            <textarea 
              className="w-100"
              onKeyUp={this.handleInputKeyUp}
              ref="postInput"
            >
            </textarea>
            <div>
              <button className="btn btn-primary text-white" onClick={this.handlePostTweet}>Tweet</button> 
              <p className="ml-5 d-inline"><span>{this.state.remainChar}</span> characters</p>
            </div>
            </div>
             <div id="tweets" className="mt-5" onClick={this.handleDeleteTweet}>
             </div>
          </div>
        </div>
      </div>
    </div>
    );

  }

}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Dashboard />,
    document.body.appendChild(document.createElement('div'))
  )
});
