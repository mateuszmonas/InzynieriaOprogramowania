package c.team.quiz.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class QuizDto {
    private String id;
    private String name;
    private List<QuestionDto> questions;
}
