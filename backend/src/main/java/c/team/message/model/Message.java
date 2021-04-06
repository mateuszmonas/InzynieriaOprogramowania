package c.team.message.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Message {
    private String sender;
    private String replyMsgId;  // Id of msg when replying, if not replying than it's null
    private MessageType type;
    private String timestamp;
    private String sessionId;
    private String content; // TODO:  Change to Content class when implementing quizzes, etc.
}
