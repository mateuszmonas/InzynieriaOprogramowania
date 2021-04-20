package c.team.quiz.model;

import io.swagger.v3.oas.annotations.Parameter;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Answer {
    @Parameter(required = true)
    private String text;
    @Parameter(required = true)
    private boolean correct;
}
