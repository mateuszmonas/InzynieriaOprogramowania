package c.team.message.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Message {
    private int id; // Unique in session, frontend sends empty
    private String sender;
    private int replyMsgId;  // Id of msg when replying, if not replying than it's 0
    private MessageType type;
    private String timestamp;
    private String sessionId;
    private String content;
}
