package c.team.session.statistics.model.timeline;

import c.team.message.model.Message;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class TimelineResponse {
    private List<Message> timeline;
}
