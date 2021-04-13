package c.team.participants.list;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ParticipantListResponse {
    String sessionId;
    String passcode;
    String approvalRoomId;
}
