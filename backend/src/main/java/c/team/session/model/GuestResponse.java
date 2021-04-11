package c.team.session.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GuestResponse {
    String sessionId;
    String sessionTitle;
    boolean guestApproval;
    String guestApprovalRoomId;
    String guestId;
}
