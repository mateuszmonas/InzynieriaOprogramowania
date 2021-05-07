package c.team.quiz.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class QuizDto {
    private String id;
    private List<QuestionDto> questions;
}
