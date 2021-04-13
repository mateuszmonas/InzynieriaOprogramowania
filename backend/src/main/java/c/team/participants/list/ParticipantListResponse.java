package c.team.participants.list;

import c.team.session.model.Guest;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Collection;

@Data
@AllArgsConstructor
public class ParticipantListResponse {
    private String leaderAccountName;
    private Collection<Guest> participants;
}
