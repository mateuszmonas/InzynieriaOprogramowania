package c.team.session.administration.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SessionCreateResponse {
    private String sessionId;
    private String passcode;
    private String approvalRoomId;
}
