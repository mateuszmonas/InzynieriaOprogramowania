package c.team.session.history;

import c.team.session.administration.model.Session;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class SessionHistoryResponse {
    private List<Session> sessions;
}
