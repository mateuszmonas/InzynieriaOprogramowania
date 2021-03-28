package c.team.session.model;


import c.team.message.model.Message;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.List;

@Data
public class Session {
    @Id
    private String id;
    private SessionLeader leader;
    private String passcode;
    private List<Message> log;

}
