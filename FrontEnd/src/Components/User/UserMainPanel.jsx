import SlackFeed from '../Admin/Maintenance/Slackfeed';
import MeetingRoomCalendar from './MeetingRoomCalendar';
import SpotifyPlayer from '../Main/SpotifyPlayer';
import './UserPage.css';

function UserMainPanel({ selectedComponent }) {
    const renderComponent = () => {
        switch (selectedComponent) {
            case 'MeetingRoomCalendar':
                return <MeetingRoomCalendar />;
            case 'SlackFeed':
                return <SlackFeed />;
            case 'SpotifyPlayer':
                return <SpotifyPlayer />;
            default:
                return <SlackFeed />;
        }
    };

    return (
        <div className="user-panel text">
            {renderComponent()}
        </div>
    );
};

export default UserMainPanel;