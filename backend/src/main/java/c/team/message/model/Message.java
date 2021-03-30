package c.team.message.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Message {
    private String sender;
    private String replyingTo;
    private MessageType type;
    private String timestamp;
    private String content; // TODO:  Change to Content class when implementing quizzes, etc.
}
