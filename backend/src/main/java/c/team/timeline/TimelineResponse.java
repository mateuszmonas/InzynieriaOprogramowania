package c.team.timeline;

import c.team.message.model.Message;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class TimelineResponse {
    private List<Message> timeline;
}
