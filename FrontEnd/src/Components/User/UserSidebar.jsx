import './UserPage.css';

function UserSidebar({ setSelectedComponent }) {
    return (
        <div className="user-sidebar"> 
            <button onClick={() => setSelectedComponent('SlackFeed')} className="user-link ">SlackFeed</button>
            <button onClick={() => setSelectedComponent('MeetingRoomCalendar')} className="user-link ">BookRoom</button>
            <button onClick={() => setSelectedComponent('SpotifyPlayer')} className="user-link">
                <span role="img" aria-label="music">🎵</span> PlayMusic
            </button>
        </div> 
    ); 
}

export default UserSidebar;