package c.team.session.model;

import c.team.message.model.Message;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@Document
public class Session {
    @Id
    private String id;
    private String title;
    private String leaderAccountId;
    private UUID passcode;
    private boolean active;
    private List<Message> log;
}
