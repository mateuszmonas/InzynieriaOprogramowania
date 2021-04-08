package c.team.session.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SessionCreateResponse {
    String sessionId;
    String passcode;
}
