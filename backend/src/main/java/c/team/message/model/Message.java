package c.team.message.model;

import c.team.account.model.User;
import c.team.session.model.Session;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
@Builder
public class Message {
    @Id
    private String id;
    private Session session;
    private User sender;
    private User replyingTo;
    private String content; // Will be changed to Content class when implementing quizzes, etc.
}
