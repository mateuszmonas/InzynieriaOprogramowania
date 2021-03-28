package c.team.session.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class GuestResponse {
    UUID token;
    String sessionId;
}
