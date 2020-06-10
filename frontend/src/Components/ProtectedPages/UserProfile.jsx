import React from 'react';
// import User from '../Support Files/User';
import { Link } from 'react-router-dom'
import Navbar from '../Support Files/Navbar'
import { connect } from 'react-redux';
import { Button } from '../Support Files/Button'
import axios from 'axios';
// import Post from '../Support Files/posts';
import { login } from '../../Actions/authActions';
import questionAvatar from '../../img/QuestionAvatar.png'
import staticStoryImg from '../../img/Unknown_location.png';


class UserProfile extends React.Component {
    constructor(props) {
        console.log('state????:', props)
        super(props)
        this.state = {
            avatar: '',
            imgFile: null,
            newAvatar: false,
            feeds: [],
            click: false
        }
    }

    //getting all posts from the user
    async componentDidMount() {
        const id = this.props.id
        try {
            let url = `http://localhost:3100/users/${id}`
            const userPost = await axios.get(url)
            this.setState({
                feeds: userPost.data.payload,
                // displayPosts: true
            })

        } catch (error) {
            console.log('ERROR', error)
        }
    }

    addDefaultSrc(ev) {
        ev.target.src = questionAvatar
    }

    addDefaultStoryImg(ev) {
        ev.target.src = staticStoryImg
    }

    handleFileInput = (e) => {
        this.setState({
            imgFile: e.target.files[0]
        })
    }

    handleFormSubmit = async (e) => {
        e.preventDefault()
        const data = new FormData()
        data.append('avatar', this.state.imgFile)
        data.append('id', this.props.id)

        try {
            const response = await axios.post('http://localhost:3100/upload', data)
            this.props.login({
                username: this.props.username,
                password: window.localStorage.getItem('password')
            })
            this.setState({
                avatar: response.data.imgURL,
            })
        } catch (error) {
            console.log('error', error)
        }
    }

    handleClick = () => {
        console.log('click')
        this.setState({
            click: true
        })
    }

    render() {
        const { avatar, feeds } = this.state
        console.log('feeds', feeds)

        return (
            <div>
                <Navbar />
                {/* <h1>UserProfile Page</h1> */}
                <div className='user-wrapper'>
                    <div className='user-box'>
                        <div className='user-box-img'>
                            <img className='user-picture' onError={this.addDefaultSrc} src={avatar || this.props.avatar} alt='img' />

                        </div>
                        <div className='user-box-bio'>
                            <h1>{this.props.username}</h1>
                            <p>Region: {this.props.region}</p>
                            {/* <p>Growing up in the town of Nibelheim after her mother died early in her life, Tifa Lockhart worked as a tour guide before the villain Sephiroth discovered his "mother" hidden in the town and went berserk, bringing the town to ashes, resulting in Tifa's father getting slain as well. After recovering from her injuries, Tifa became a member of AVALANCHE, an anti-Shinra resistance group, as well as the owner and tender of her own bar in Midgar, 7th Heaven. Since then, Tifa has become good friends with Cloud and his party, and has aided them on his missions often.</p> */}
                            {this.props.info}
                            <form onSubmit={this.handleFormSubmit}>
                                <input type='file'
                                    onChange={this.handleFileInput}
                                    style={{ display: 'none' }}
                                    ref={fileInput => this.fileInput = fileInput}
                                />
                                <Button onClick={() => this.fileInput.click()}
                                        buttonStyle="btn--sight--solid"
                                        buttonSize="btn--medium"
                                >Choose Picture
                                </Button>
                                <input
                                    className='upload-btn' 
                                    type='submit' 
                                    value='Upload' 
                                    style={{color: 'blue'}}
                                    size={{}}
                                />
                            </form>
                        </div>
                    </div>
                </div>
                <br></br>
                <h1>Your Stories</h1>
                <div className='masonry-holder'>

                    {feeds.map((feed, i) => {
                        return (
                            <div key={i} className="masonry-blocks">
                                <img onError={this.addDefaultStoryImg} src={feed.file_src + `${i}`} alt='img' />
                                <Link to={{
                                    pathname: '/storypage',
                                    state: {
                                        storyProps: feed
                                    }
                                }}>
                                    <h3>{feed.p_username}</h3>
                                   stat <div className="block-content">
                                        <p>{feed.caption}</p>
                                    </div>
                                </Link>
                                
                            </div>
                        )
                    })}
                    <div className="masonry-blocks-add">
                        <Link className='nav-link' to='/newstory'>
                            <img src="https://www.ucdavis.edu/sites/default/files/images/focal_link/add-blue_2.png" alt='img' />
                        </Link>
                    </div>
                </div>
                {/* <br></br>
                <div className='user-posts'>
                    <Post />
                </div> */}


            </div>
        );

    }

}

const mapStateToProps = (state, ownProps) => {
    console.log('check state:', state)
    return state.auth.payload
}


export default (connect(mapStateToProps, { login })(UserProfile));

// <div className='user-header'>
//                     <ul>
//                         <li className='user-center'>
//                         </li>
//                         <li className='user-left'>
//                             <form onSubmit={this.handleFormSubmit}>
//                                 <input type='file'
//                                     onChange={this.handleFileInput}
//                                     style={{ display: 'none' }}
//                                     ref={fileInput => this.fileInput = fileInput}
//                                 />
//                                 <button onClick={() => this.fileInput.click()}>Choose picture</button>
//                                 <input type='submit' value='Upload' />
//                             </form>
//                         </li>

//                         <li className='user-right'>
//                             <div className='region'>Region:{this.props.region}</div>
//                         </li>

//                         <li>
//                             <h2>{this.props.username}</h2>
//                             <img className='avatar-picture' onError={this.addDefaultSrc} src={avatar || this.props.avatar} alt='img' />
//                         </li>

//                         {/* <li><img className='avatar-picture' src={avatar || this.props.avatar} alt='' /></li> */}


//                         {/* <ActivityBar props={this.props}/> */}
//                     </ul>
//                 </div>
//                 <br />
//                 <div className='user-info'>
//                     <p>Growing up in the town of Nibelheim after her mother died early in her life, Tifa Lockhart worked as a tour guide before the villain Sephiroth discovered his "mother" hidden in the town and went berserk, bringing the town to ashes, resulting in Tifa's father getting slain as well. After recovering from her injuries, Tifa became a member of AVALANCHE, an anti-Shinra resistance group, as well as the owner and tender of her own bar in Midgar, 7th Heaven. Since then, Tifa has become good friends with Cloud and his party, and has aided them on his missions often.</p>
//                     {/* {this.props.info} */}
//                     {/* <Info /> */}
//                 </div>