package c.team.message.model;

import c.team.session.model.Session;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.time.Instant;

@Data
@Builder
public class Message {
    @Id
    private String id;
    private String sessionId;
    private String sender;
    private String replyingTo;
    private MessageType type;
    private Instant timestamp;
    private String content; // Will be changed to Content class when implementing quizzes, etc.
}
