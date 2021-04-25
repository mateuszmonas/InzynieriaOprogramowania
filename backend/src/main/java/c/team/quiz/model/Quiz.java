package c.team.quiz.model;

import lombok.Builder;
import lombok.Data;
import nonapi.io.github.classgraph.json.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Builder
@Document
public class Quiz {     // Can be used as 'content' field of message (QUIZ message)
    @Id
    String id;
    String userId;
    List<Question> questions;
}
