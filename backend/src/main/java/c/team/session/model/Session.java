package c.team.session.model;


import c.team.account.model.UserAccount;
import c.team.message.model.Message;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class Session {
    @Id
    private String id;
    private String title;
    private UserAccount leader;
    private UUID passcode;
    private List<Message> log;

}
