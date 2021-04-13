package c.team.quiz.model;

import io.swagger.v3.oas.annotations.Parameter;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.util.List;

@Data
@NoArgsConstructor
public class Question {
    @Parameter(required = true)
    @NotBlank
    private String content;
    @NotEmpty
    @Parameter(required = true)
    private List<Integer> correctAnswerIds;
    @NotEmpty
    @Parameter(required = true)
    private List<String> answers;
}
