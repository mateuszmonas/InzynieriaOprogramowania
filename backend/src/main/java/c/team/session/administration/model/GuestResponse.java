package c.team.session.administration.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GuestResponse {
    private String sessionId;
    private String sessionTitle;
    private boolean guestApproval;
    private String guestApprovalRoomId;
    private String guestId;
}
