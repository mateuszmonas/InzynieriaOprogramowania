package c.team.session.statistics.model;

import c.team.quiz.model.Question;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class SessionAnswersDto {
    private Question question;
    private Map<Integer, Integer> answerCounts;
}
