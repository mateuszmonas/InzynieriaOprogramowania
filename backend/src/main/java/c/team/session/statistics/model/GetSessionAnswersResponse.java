package c.team.session.statistics.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class GetSessionAnswersResponse {
    private List<SessionAnswersDto> sessionAnswers;
}
