import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import axios from "axios";
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import TimeAgo from 'timeago-react';
import logo from './logo.png';
import BirthdayCake from './BirthdayCake.jpg';
import SidebarPanda from './sidebarpanda.jpg';
import upcarot from './upcarot.png';
import downcarot from './downcarot.png';

//Modal component settings
Modal.setAppElement("#app")
const desktopModalStyles = {
  content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    padding: '5px',
    transform: 'translate(-50%, -50%)'
  }
};
const mobileModalStyles = {
  content : {
    top: '50%',
    left: '48%',
    bottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '90%',
    padding: '5px',
    transform: 'translate(-50%, -50%)'
  }
};

//Some helper functions
const removeNulls_Duplicates = (arr)=>{
  var cleanArray = arr.filter((el)=> {
      return el != null;
  });
  const cleanSet = new Set(cleanArray)
  cleanArray = [...cleanSet]
  return cleanArray;
}
const roundToThousands = (count)=>{
  var roundedCount = (count - count%100);
  roundedCount = roundedCount.toString();
  var solution;
  if(roundedCount.length < 4){
    return count;
  }else if(roundedCount.length === 4){
    if(roundedCount.charAt(1) === 0){
      solution = roundedCount.charAt(0) + "k";
    } else {
      solution = roundedCount.charAt(0) + "." + roundedCount.charAt(1) + "k";
    }
    return solution;
  }else if(roundedCount.length === 5){
    if(roundedCount.charAt(2) === 0){
      solution = roundedCount.charAt(0) + roundedCount.charAt(1) + "k";
    } else {
      solution = roundedCount.charAt(0) + roundedCount.charAt(1) + "." + roundedCount.charAt(2) + "k";
    }
    return solution;
  }else if(roundedCount.length === 6){
    solution = roundedCount.charAt(0) + roundedCount.charAt(1) + roundedCount.charAt(2) + "k";
    return solution;
  }else{
    return "1M+"
  }
}
const doesPropertyExist = (prop)=>{
  if(prop == null){
    return false;
  }
  return true;
}
const truncateString = (length, text)=>{
  var shortText = text.substring(0, length-1) + "..."
  return shortText;
}

//parent component
class Reddit extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      flair_tags: [],
      modalIsOpen: false,
      screenWidth: null,
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  componentDidMount() {
    axios.get(`https://www.reddit.com/r/trashpandas.json?raw_json=1`).then(res => {
      const posts = res.data.data.children.map(obj => obj.data);
      const flair_tags = removeNulls_Duplicates(res.data.data.children.map(obj => obj.data.link_flair_text));
      window.addEventListener("resize", this.updateWindowDimensions());
      this.setState({ posts, flair_tags });
    });
  };
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions)
  }
  updateWindowDimensions() {
    this.setState({ screenWidth: window.innerWidth });
  }
  openModal() {
    this.setState({modalIsOpen: true});
  }
  afterOpenModal() {
    this.subtitle.style.color = '#FF4301';
  }
  closeModal() {
    this.setState({modalIsOpen: false});
  }
  render() {
    return (
      <div className="container-fluid">
        {this.state.screenWidth > 1000 ? <DesktopPageHeader/> : <MobilePageHeader/>}
        <div className="row bg-background" id="main-container">
          <div className="col-xl-2 p-0 m-0" id="left-margin"></div>
          <div className="col-xl-5 m-0 p-0">
            {<ul className="m-0 p-0">
              {this.state.posts.map(post => {
              return <div className="m-0 p-0  post-container bg-light rounded" key={post.id}>
                  <div className="row m-0 mt-1 mt-xl-3 mb-0 bg-white rounded">
                    <ScoreBar score={post.score} openModal={this.openModal} location="sidebar"/>
                  <div className="col-lg-11 d-inline p-0">
                    <PostHeader author={post.author} author_flair_text={post.author_flair_text} created={post.created} link_flair_text={post.link_flair_text} title={post.title}/>
                    <PostBody content={post}/>
                    <PostFooter num_comments={post.num_comments} score={post.score} openModal={this.openModal}/>
                  </div>   
                </div>
              </div>;})}
            </ul>}
          </div>
          <div className="col-xl-3 p-0 mt-3 pl-xl-4 m-0" id="static-content-container">
            <AboutCommunityCard/>
            <div className="row rounded bg-white m-0 mt-3 mb-3">
              <strong className="row col-xl-12 m-0 bg-secondary p-3 text-white rounded-top">Filter by flair</strong>
              <div className="row m-0 p-3 w-100">
                <FlairMenu openModal={this.openModal} array={this.state.flair_tags}/>
              </div>
            </div>
            <div className="row w-100 m-0 p-0 mb-3 d-none d-xl-block">
                <img src={SidebarPanda} className="img-fluid rounded" alt="Smiling Raccoon"/>
            </div>
            <RulesCard/>
            <div className="row w-100 m-0 p-0 mb-3">
                <img src={SidebarPanda} className="img-fluid rounded vertical-flip d-none d-xl-block" alt="Upsidown Smiling Raccoon"/>
            </div>
            <ModeratorsCard openModal={this.openModal}/>
            <NavigationCard/>
            <div className="row"><a className="reddit-button mx-auto p-3 text-nowrap text-center" href="#top" style={{width: "130px"}}>BACK TO TOP</a></div>
          </div>
          <div className="col-xl-2 p-0 m-0" id="right-margin"></div>
        </div>
          <div className="container-fluid">
            <Modal isOpen={this.state.modalIsOpen} onAfterOpen={this.afterOpenModal} style={this.state.screenWidth<1000 ? mobileModalStyles : desktopModalStyles} onRequestClose={this.closeModal}>
                <i className="float-right far fa-window-close p-0 force-pointer p-2 p-xl-0" onClick={this.closeModal}></i>
                <h4 className="m-2 text-center" ref={subtitle => this.subtitle = subtitle}>This feature has not been implimented...</h4>
                <h6 className="text-center m-0 p-0">Thank you for taking the time to check out my project.</h6>
                <hr/>
                <div className="container row m-0 p-0">
                  <div className="text-center p-0 m-0 d-inline row d-block align-center mx-auto">
                    <a href="https://www.github.com/omeganix" className="p-1 modal-footer-icon"><i className="fab fa-github-square"></i></a>
                    <a href="mailto:n.t.krieger@gmail.com" className="p-1 modal-footer-icon"><i className="fas fa-envelope-square"></i></a>
                    <a href="https://www.linkedin.com/in/ntkrieger" className="p-1 modal-footer-icon"><i className="fab fa-linkedin"></i></a>
                    <label className="d-block text-center">Get in Touch!</label>
                  </div>
                </div>
            </Modal>
          </div>
      </div>
    );
  }
}
//child components
class DesktopPageHeader extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }
  render(){
    return <header>
    <div className="row bg-black p-5"></div>
    <div className="row">
      <div className="col-xl-2 p-0 m-0" id="header-left-margin"></div>
      <div className="col-xl-10 col-lg-12 d-inline p-0" id="header-content">
        <div className="d-inline mr-0 pr-0" id="header-left-image">
          <img className="header-image rounded-circle float-left" src={logo} alt="Raccoon Icon"/>
        </div>
        <h1 className="pb-0 mb-0 d-inline">Trashpandas</h1>
        <button className="reddit-button mt-n2 ml-sm-5 p-2 " onClick={this.openModal} style={{width: "90px"}}>JOIN</button>
        <small className="pt-0 mt-0 d-block">A small portfoio app by Nate Krieger</small>
      </div>
    </div>
  </header>
  }
}
class MobilePageHeader extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }
  render(){
    return <header>
    <div className="bg-black d-block p-5 row"></div>
    <img className="rounded-circle d-block mx-auto mt-n4" style={{width: "25%", height: "25%"}} src={logo} alt="Raccoon Icon"/>
    <h1 className="d-block mb-0 mt-n3 text-center mx-auto">Trashpandas</h1>
    <small className="pt-0 mb-3 mt-0 text-center d-block mx-auto">A small portfoio app by Nate Krieger</small>
    <p className="post-header-text text-color-gray text-center">Welcome to r/trashpandas: Your home for all things trashpanda-related! Here at r/trashpandas, we strive to share the cutest & *most awesomest* content there is! #🦝🦝🦝🦝🦝🦝🦝🦝🦝🦝🦝</p>
    <span className="text-center d-block mx-auto">
      <strong>231K </strong>
      <label>Members ·</label>
      <strong> 130 </strong>
      <label>Online</label>
    </span>
    <button className="reddit-button d-block mx-auto p-1 m-2" style={{width: "75%"}} onClick={this.openModal}>Join Community</button> 
        
        

  </header>
  }
}
class ModeratorsCard extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
    this.openModal = this.openModal.bind(this);
  }
  openModal(){
    this.props.openModal();
  }
  render(){
    return <div className="row rounded bg-white m-0 mt-3 mb-3">
    <div className="row col-xl-12 m-0 bg-secondary d-inline p-3 text-white rounded-top d-none d-xl-block">
      <strong >Moderators</strong>
      <div className="float-right force-pointer" onClick={this.openModal}><i className="fas fa-envelope"></i></div>
    </div>
    <div className="row m-0 p-3 d-block">
      <a href="https://www.reddit.com/user/GoreFox/" className="d-inline modlist-link m-2">u/GoreFox</a>
      <label className="bg-flairtext modlist-flairtext">Trashpanda Enthusiast</label>
      <a href="https://www.reddit.com/user/JanetYellensFuckboy/" className="d-inline modlist-link m-2">u/JanetYellensFuckboy</a>
      <label className="bg-flairtext modlist-flairtext d-inline">takes credit for Guardia...</label>
      <a href="https://www.reddit.com/user/BotBust/" className="d-block modlist-link m-2">u/BotBust</a>
      <a href="https://www.reddit.com/user/tsmaster777/" className="d-block modlist-link m-2">u/tsmaster777</a>
      <a href="https://www.reddit.com/user/PapaTrashusPandusI/" className="d-inline modlist-link m-2">u/PapaTrashusPandusI</a>
      <label className="bg-flairtext modlist-flairtext mb-0">Lucipurrrr we are here</label>
      <a href="https://www.reddit.com/user/urbanspacecowboy/" className="d-block modlist-link  m-2">u/urbanspacecowboy</a>
      <a href="https://www.reddit.com/user/BotTerminator/" className="d-block modlist-link m-2">u/BotTerminator</a>
      <a href="https://www.reddit.com/user/BotDefense/" className="d-block modlist-link m-2">u/BotDefense</a>
      <a href="https://www.reddit.com/r/trashpandas/about/moderators/" className="d-block text-right modlist-link m-3">VIEW ALL MODERATORS</a>
    </div>
  </div>
  }
}
class AboutCommunityCard extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }
  render(){
    return <div className="row rounded bg-white m-0 mb-3 d-none d-xl-block" id="static-title-card">
    <strong className="row col-xl-12 m-0 bg-secondary p-3 text-white rounded-top">About Community</strong>
    <p className="p-3">Welcome to r/trashpandas: Your home for all things trashpanda-related! Here at r/trashpandas, we strive to share the cutest & *most awesomest* content there is! #🦝🦝🦝🦝🦝🦝🦝🦝🦝🦝🦝</p>
    <div className="row m-0 p-0 w-100">
      <div className="col-xl-5 m-0">
        <h5 className="mb-0">229k</h5><small className="mt-0">Members</small>
      </div>
      <div className="col-xl-7 m-0">
        <h5 className="mb-0">130</h5><small className="mt-0">Online</small>
      </div>
    </div>
    <hr className="row mx-auto" width="90%"></hr>
    <div className="row w-100 m-0 p-0 mb-3">
      <img className="col-xl-2 img-fluid m-0 font-weight-light" alt="Birthday Cake" src={BirthdayCake}/>
    <label className="col-xl-10 p-0 pt-2 h5">Created July 11, 2015</label>
    </div>
</div> 
  }
}
class RulesCard extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }
  render(){
    return <div className="row rounded bg-white m-0 mt-3 mb-3 d-none d-xl-block">
    <strong className="row col-xl-12 m-0 bg-secondary p-3 text-white rounded-top">r/trashpandas Rules</strong>
    <ol className="m-1 pl-4 pr-4 pt-2 pb-2 container-fluid">
      <CollapsableMenuItemOne/>
      <hr className="row m-2 mx-auto divider"></hr>
      <li className="plaintext">All posts must pertain to trashpandas</li>
      <hr className="row mx-auto m-2"></hr>
      <CollapsableMenuItemThree/>
      <hr className="row mx-auto m-2"></hr>
      <CollapsableMenuItemSimple title="No trashpanda marraige proposals" text="No pictures of giving rings to trashpandas. This engagement is off. We've seen this post many times here, and we needn't see it anymore. Just go to Las Vegas."/>
      <hr className="row mx-auto m-2"></hr>
      <li className="plaintext">No merchandise</li>
      <hr className="row mx-auto m-2"></hr>
      <CollapsableMenuItemSimple title="No profanity" text="This is a wholesome sub for people of all ages. Please keep profanity to a minimum."/>
      <hr className="row mx-auto m-2"></hr>
      <CollapsableMenuItemSimple title="Keep it apolitical" linksrc="https://www.reddit.com/r/trashpandas" linktext="r/trashpandas " text="supersede politics. Please don't bring politics into this subreddit."/>
      <hr className="row mx-auto m-2"></hr>
      <CollapsableMenuItemSimple title="No Bamboozlement" text="Any users caught bamboozling us will be banned. Please don't bamboozle."/>
    </ol>
  </div>
  }
}
class NavigationCard extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }
  render(){
    return <div className="row rounded bg-white m-0 mt-3">
    <div className="col-xl-5 p-3">
      <label className="font-weight-bold d-block">Reddit</label>
      <a href="https://about.reddit.com/" className="d-block plaintext-link">About</a>
      <a href="https://about.reddit.com/careers/" className="d-block plaintext-link">Careers</a>
      <a href="https://about.reddit.com/press/" className="d-block plaintext-link">Press</a>
      <a href="https://www.redditinc.com/advertising" className="d-block plaintext-link">Advertise</a>
      <a href="http://www.redditblog.com/" className="d-block plaintext-link">Blog</a>
    </div>
    <div className="col-xl-7 p-3">
      <label className="font-weight-bold">Using Reddit</label>
      <a href="https://www.reddithelp.com/" className="d-block plaintext-link">Help</a>
      <a href="https://www.reddit.com/mobile/download" className="d-bloc plaintext-link">Reddit App</a>
      <a href="https://www.reddit.com/coins" className="d-block plaintext-link">Reddit Coins</a>
      <a href="https://www.reddit.com/premium" className="d-block plaintext-link">Reddit Premium</a>
      <a href="http://redditgifts.com/" className="d-block plaintext-link">Reddit Gifts</a>
      <a href="https://www.reddit.com/subreddits/a-1/" className="d-block plaintext-link">Communities</a>
      <a href="https://www.reddit.com/posts/a-1/" className="d-block plaintext-link">Top Posts</a>
    </div>
    <div className="row m-0 pl-3 mb-3 mt-3 pb-0">
      <a href="https://www.redditinc.com/policies/user-agreement" className="plaintext-link mr-2">Terms</a><span>|</span>
      <a href="https://www.redditinc.com/policies/content-policy" className="plaintext-link mr-2 ml-2">Content Policy</a><span>|</span>
      <a href="https://www.reddit.com/help/privacypolicy" className="plaintext-link mr-2 ml-2">Privacy Policy</a><span>|</span>
      <a href="https://www.reddit.com/help/healthycommunities/" className="plaintext-link ml-2">Mod Policy</a>
    </div>
    <div className="row m-0 p-2 pl-3 mb-0 mt-0 pt-0">
    <p>Reddit Inc © 2019. All rights reserved</p>
    </div>
</div>
  }
}
class PostHeader extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }
  render(){
    return <div className="m-0 p-0 pt-1 pb-1">
      <div className="lightweight-text text-secondary post-header-text pl-2">Posted by u/{this.props.author} 
      <div className="bg-flairtext text-dark d-inline pl-1">{this.props.author_flair_text} </div><TimeAgo datetime={this.props.created * 1000}/></div>
      {doesPropertyExist(this.props.link_flair_text) ? <div className="badge badge-pill p-2 badge-light d-inline p-0 m-0">{this.props.link_flair_text}</div> : null}
      <h5 className="pl-2 d-inline">{this.props.title}</h5>
    </div>
  }
}
class ScoreBar extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
    this.openModal = this.openModal.bind(this);
  }
  openModal(){
    this.props.openModal();
  }
  render(){
    if(this.props.location === "sidebar"){
      return <div className="col-lg-1 bg-light text-center m-0 p-2 rounded-left score-container d-none d-lg-inline" id="post-score-sidebar">
        <button className="rounded arrow-up-container m-0" onClick={this.openModal}><i className="fas fa-arrow-up"></i></button>
        <div className="m-0 p-0 score-text d-block mx-auto text-center">{roundToThousands(this.props.score)}</div>
        <button className="rounded arrow-down-container mb-0" onClick={this.openModal}><i className="fas fa-arrow-down"></i></button>
      </div>
    } else {
      return <div className="text-center m-1 score-container d-inline d-lg-none" id="post-score-sidebar">
        <button className="rounded arrow-up-container m-0 d-inline" onClick={this.openModal}><i className="fas fa-arrow-up"></i></button>
        <div className="m-0 p-0 score-text d-inline">{roundToThousands(this.props.score)}</div>
        <button className="rounded arrow-down-container mb-0 d-inline" onClick={this.openModal}><i className="fas fa-arrow-down"></i></button>
    </div>
    }
  }
}
class PostBody extends React.Component{
  constructor(props){
    super(props);
    this.state = {}
  }
  render(){
    if(this.props.content.crosspost_parent_list != null){
      return <div className="container-fluid m-0 p-0"><CrossPost content={this.props.content.crosspost_parent_list[0]}/></div>
    }else if(this.props.content.post_hint === "image"){
      return <div className="container-fluid m-0 p-0"><ImagePost images={this.props.content.preview.images[0]}/></div>
    }else if(this.props.content.is_video === true){
      return <div className="container-fluid m-0 p-0"><VideoPost media={this.props.content.media} url={this.props.content.url}/></div>
    }else if(this.props.content.link_flair_text === "question"){
      return <div className="container-fluid m-0 p-0 pl-2"><QuestionPost text={this.props.content.selftext}/></div>
    }else if(this.props.content.link_flair_text === "meta"){
      return <div></div>
    }else{
      return <div className="container-fluid m-0 p-0 pl-2"><LinkPost url={this.props.content.url} thumbnail={this.props.content.thumbnail}/></div>
    }
  }
}
class VideoPost extends React.Component{
  constructor(props){
    super(props);
    this.state = {}
  }
  render(){ //It would be great to use the video-react component here
    return <div className="container fluid">
      <video controls autoPlay="" type="video/mp4" className="embed-responsive" src={this.props.media.reddit_video.fallback_url}></video>
    </div>
  }
}
class ImagePost extends React.Component{
  constructor(props){
    super(props);
    this.state = {}
  }
  render(){
    return <div className="p-0 mx-auto">
      <img src={this.props.images.source.url} alt="post image" className="img-fluid mx-auto d-block"></img>
    </div>
  }
}
class QuestionPost extends React.Component{
  constructor(props){
    super(props);
    this.state = {}
  }
  render(){
    return <div className="container-fluid pl-0 pt-2">
      <p className="post-text">{this.props.text}</p>
    </div>
  }
}
class LinkPost extends React.Component{
  constructor(props){
    super(props);
    this.state = {}
  }
  render(){ 
    if(this.props.thumbnail === "self"){
      return <div className="container-fluid pl-0 pt-2">
      <a href={this.props.url} className="post-text d-inline modlist-link">{truncateString(40,this.props.url)}</a>
      </div>
    } else {
      return <div className="container-fluid pl-0 pt-2">
      <a href={this.props.url} className="post-text d-inline modlist-link">{truncateString(40,this.props.url)}</a>
      <img className="img-responsive float-right d-inline" src={this.props.thumbnail} alt="thumbnail"></img>
    </div>
    }
  }
}
class CrossPost extends React.Component{
  constructor(props){
    super(props);
    this.state = {}
  }
  render(){
    if(this.props.content.post_hint === "image"){
      return <div className="container-fluid m-0 p-0"><ImagePost images={this.props.content.preview.images[0]}/></div>
    }else if(this.props.content.is_video === true){
      return <div className="container-fluid m-0 p-0"><VideoPost media={this.props.content.media} url={this.props.content.url}/></div>
    }else if(this.props.content.link_flair_text === "question"){
      return <div className="container-fluid m-0 p-0"><QuestionPost text={this.props.content.selftext}/></div>
    }else{
      return null
    }
  }
}
class PostFooter extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      shareMenuIsVisible: false,
      shareMenuLocation: {},
      shareMenuDropTopLocation: {},
      moreMenuIsVisible: false,
    };
    this.modalClick = this.modalClick.bind(this);
    this.shareClick = this.shareClick.bind(this);
    this.moreClick = this.moreClick.bind(this);
  }
  modalClick(){
    this.setState(state => ({
      moreMenuIsVisible: false,
      shareMenuIsVisible: false,
    }));
    this.props.openModal();
  }
  moreClick(){
    this.setState(state => ({
      moreMenuLocation: document.getElementById('more-button').getBoundingClientRect(),
      moreMenuIsVisible: !state.moreMenuIsVisible,
      shareMenuIsVisible: false,
    }));
    document.getElementById('more-drop-1').style.top = this.moreMenuLocation.bottom;
    document.getElementById('more-drop-1').style.left = this.moreMenuLocation.left;
  }
  shareClick(){
    this.setState(state => ({
      shareMenuLocation: document.getElementById('share-button').getBoundingClientRect(),
      shareMenuIsVisible: !state.shareMenuIsVisible,
      moreMenuIsVisible: false,
    }));
    document.getElementById('share-drop-1').style.top = this.shareMenuLocation.bottom;
    document.getElementById('share-drop-1').style.left = this.shareMenuLocation.left;
  } 
  render(){
    return <div className="container-fluid row p-0 p-1 m-0">
      <ScoreBar score={this.props.score} openModal={this.props.openModal} location="footer"/>
      <div className="m-0 d-inline">
        <button className="footer-menu-button m-1 ml-0 h-100 my-auto" onClick={this.modalClick}><i className="fas fa-comment-alt mr-1"></i>{this.props.num_comments} Comments</button>
      </div>
      <div className="m-0 d-inline">
        <button className="footer-menu-button m-1 h-100 my-auto" onClick={this.shareClick} id="share-button"><i className="fas fa-share mr-1"></i>Share</button>
        <button id="share-drop-1" onClick={this.modalClick} className={this.state.shareMenuIsVisible ? "footer-drop-menu-item d-block ml-1 mt-n1" : "d-none"}><i className="fas fa-link mr-2"></i>Copy Text</button>
        <button id="share-drop-2" onClick={this.modalClick} className={this.state.shareMenuIsVisible ? "footer-drop-menu-item border-bottom-2 d-block ml-1 mt-4" : "d-none"}><i className="fas fa-code ml-n1 mr-2"></i>Embed</button>
      </div>
      <div className="m-0 d-inline">
        <button className="footer-menu-button m-1 h-100 my-auto" onClick={this.modalClick}><i className="fas fa-folder-plus mr-1" ></i>Save</button>
      </div>
      <div className="m-0 d-inline">
        <button id="more-button" className="footer-menu-button m-1 h-100 my-auto" onClick={this.moreClick}><i className="fas fa-ellipsis-h"></i></button>
        <button id="more-drop-1" onClick={this.modalClick} className={this.state.moreMenuIsVisible ? "footer-drop-menu-item d-block ml-1 mt-n1" : "d-none"}><i className="fas fa-flag mr-2"></i>Hide</button>
        <button id="more-drop-2" onClick={this.modalClick} className={this.state.moreMenuIsVisible ? "footer-drop-menu-item d-block ml-1 border-bottom-2 mt-4" : "d-none"}><i className="fas fa-ban mr-2"></i>Report</button>
      </div>
    </div>
  }
}
class FlairMenu extends React.Component{
  constructor(props){
    super(props);
    this.state = {filterBy : null} //filters not yet implimented
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(){
    this.props.openModal();
  }

  render(){
    return(<div>
      {<ul className="mb-4 p-0">
        {this.props.array.map(tag => {
            return <div className="m-0 p-0 d-inline" key={tag}>
              <div onClick={this.handleClick} className="badge badge-pill p-2 badge-light d-inline p-0 m-0 font-weight-normal force-pointer">{tag}</div>
            </div>;})}
        </ul>}
    </div>
    )
  }
}
class CollapsableMenuItemOne extends React.Component{
  constructor() {
    super();
    this.state = {isMenuCollapsed : true}
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState(state => ({
      isMenuCollapsed: !state.isMenuCollapsed,
    }));
  }
  render(){
    return <li className="plaintext" onClick={this.handleClick}>No clickbait titles
    <img className="img-fluid float-right mt-2" height="12px" width="12px" src={this.state.isMenuCollapsed ? downcarot : upcarot} alt={this.state.isMenuCollapsed ? "closed" : "open"}/>
    <div className={this.state.isMenuCollapsed ? "d-none" : ""}>
    <label className="m-2">Examples:</label>
      <ol>
        <li className="p-1">You won't believe what happens!</li>
        <li className="p-1">Watch until the end!</li>
        <li className="p-1">You'll never guess...</li>
      </ol>
    </div>
  </li>
  }
}
class CollapsableMenuItemThree extends React.Component{
  constructor() {
    super();
    this.state = {isMenuCollapsed : true}
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState(state => ({
      isMenuCollapsed: !state.isMenuCollapsed,
    }));
  }
  render(){
    return <li className="plaintext" onClick={this.handleClick}>No dead trashpandas
    <img className="img-fluid float-right mt-2" height="12px" width="12px" src={this.state.isMenuCollapsed ? downcarot : upcarot} alt={this.state.isMenuCollapsed ? "closed" : "open"}/>
    <div className={this.state.isMenuCollapsed ? "d-none" : ""}>
      <ol>
        <li className="p-1">Pictures of deceased trashpandas are not permitted in this sub. This includes taxidermied ones. When in doubt: Do not post it.</li>
        <li className="p-1">Advocating killing or harming trashpandas will not be tolerated.</li>
      </ol>
    </div>
  </li>
  }
}
class CollapsableMenuItemSimple extends React.Component{
  constructor(props) {
    super(props);
    this.state = {isMenuCollapsed : true}
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState(state => ({
      isMenuCollapsed: !state.isMenuCollapsed,
    }));
  }
  render(){
    return <li className="plaintext" onClick={this.handleClick}>{this.props.title}
    <img className="img-fluid float-right mt-2" height="12px" width="12px" src={this.state.isMenuCollapsed ? downcarot : upcarot} alt={this.state.isMenuCollapsed ? "closed" : "open"}/>
    <div className={this.state.isMenuCollapsed ? "d-none" : ""}>
        <p className="m-2"><a href={this.props.linksrc} className="modlist-link">{this.props.linktext}</a>{this.props.text}</p>
    </div>
  </li>
  }
}

//React DOM render
ReactDOM.render(<Reddit />, document.getElementById("app")); 