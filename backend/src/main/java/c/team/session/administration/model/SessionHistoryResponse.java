package c.team.session.administration.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class SessionHistoryResponse {
    private List<Session> sessions;
}
