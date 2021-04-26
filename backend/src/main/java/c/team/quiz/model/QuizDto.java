package c.team.quiz.model;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class QuizDto {
    private String id;
    private String userId;
    private List<Question> questions;
}
