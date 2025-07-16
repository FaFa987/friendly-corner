import './UserPage.css';
import { Link } from 'react-router-dom';

function UserSidebar({ setSelectedComponent }) {
    return (
        <div className="user-sidebar"> 
            <button onClick={() => setSelectedComponent('SlackFeed')} className="user-link ">SlackFeed</button>
            <button onClick={() => setSelectedComponent('MeetingRoomCalendar')} className="user-link ">BookRoom</button>
            <Link to="/spotify-player" className="user-link" style={{ textAlign: 'left', display: 'block' }}>
                <span role="img" aria-label="music">🎵</span> PlayMusic
            </Link>
        </div> 
    ); 
}

export default UserSidebar;