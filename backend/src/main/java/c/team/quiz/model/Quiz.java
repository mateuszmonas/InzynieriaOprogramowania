package c.team.quiz.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nonapi.io.github.classgraph.json.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@Document
@NoArgsConstructor
@AllArgsConstructor
public class Quiz {     // Can be used as 'content' field of message (QUIZ message)
    @Id
    private String id;
    private String userId;

    public Quiz(String userId) {
        this.userId = userId;
    }
}
