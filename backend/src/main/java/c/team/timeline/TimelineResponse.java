package c.team.timeline;

import c.team.message.model.Message;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class TimelineResponse {
    List<Message> timeline;
}
