package c.team.session.statistics.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Data
@Builder
@Document
@NoArgsConstructor
@AllArgsConstructor
public class SessionAnswers {
    @Id
    private String id;
    private String sessionId;
    private String questionId;
    private Map<Integer, Integer> answerCounts;

    public SessionAnswers(String sessionId, String questionId, Map<Integer, Integer> answerCounts) {
        this.sessionId = sessionId;
        this.questionId = questionId;
        this.answerCounts = answerCounts;
    }
}
