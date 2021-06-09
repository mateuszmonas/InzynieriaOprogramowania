import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import { customEmojis } from './CustomEmojis.js';
import "./reactions.css";


const Reactions = ({handleEmojiSelect}) => {
    return (
        <div className="reactions">
            <Picker
                showPreview={false}
                showSkinTones={false}
                include={['custom']}
                custom={customEmojis}
                onSelect={handleEmojiSelect}
            />
        </div>
    )
}
export default Reactions;