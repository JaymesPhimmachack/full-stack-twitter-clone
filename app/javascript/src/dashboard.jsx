import React from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';

import { authenticate, getTweets, postTweet, logoutUser, deleteTweet } from './requests/requests';

import 'bootstrap/dist/css/bootstrap';
import './dashboard.scss';



const Tweet = (props) => {
  const {
    username,
    message,
    id
  } = props.tweet;

  return (
    <div className="tweet border border-info p-2 bg-white">
      <div><span className="username mr-5">{username}</span><span className="screenName">@{username}</span></div>
      <div className="d-flex justify-content-between mt-3">
        <span className="post">{message}</span><a onClick={props.handleDeleteTweet} id={id} href="#">Delete Tweet</a>
      </div>
    </div>
  );
}


class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'undefined',
      tweetCount: 0,
      charLength: 140,
      remainChar: 140,
      postLength: 1,
      tweets: []
    };

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
          getTweets()
            .then(response => {
              this.setState({ tweetCount: response.tweets.length, tweets: response.tweets })
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
              this.setState({ tweetCount: response.tweets.length, tweets: response.tweets })
            })
            .catch(error => console.log(error));
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

  handleDeleteTweet(e) {
    e.preventDefault();
    let id = e.target.id;
    console.log(id)
    deleteTweet(id)
      .then(() => {
        getTweets()
          .then(response => {
            this.setState({ tweetCount: response.tweets.length, tweets: response.tweets })
          })
          .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
  };

  render() {
    const { tweets, username, tweetCount, remainChar } = this.state;

    return (
      <div ref="dashboard" className="container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-5">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="#">Home <span  className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
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
        <div className="row">
          <div className="col-xs-12 col-md-4">
            <div className="mb-5 mt-3">
              <div className="user p-2">
                <p className="username">{username}</p>
                <p className="screenName">{'@' + username}</p>
              </div>
              <div className="bg-white p-2">
                <div className="d-inline-block mr-2">
                  <p>Tweets</p>
                  <p>{tweetCount}</p>
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
          </div> 
          <div className="col-xs-12 col-md-8">
            <div className="mt-3">
              <div>
                <textarea 
                  className="w-100"
                  onKeyUp={this.handleInputKeyUp}
                  ref="postInput"
                />
                <div>
                  <button className="btn btn-primary text-white" onClick={this.handlePostTweet}>Tweet</button> 
                  <p className="ml-5 d-inline"><span>{remainChar}</span> characters</p>
                </div>
              </div>
              <div id="tweets" className="mt-5">
                {(() => {
                  return tweets.map(tweet => {
                    return <Tweet key={tweet.id} tweet={tweet} handleDeleteTweet={this.handleDeleteTweet} />;
                  })
                })()}
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
