package c.team.quiz.model;

import io.swagger.v3.oas.annotations.Parameter;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
@NoArgsConstructor
public class Question {
    @Parameter(required = true)
    @NotBlank
    private String content;
    @Valid
    private List<Answer> answers;
}
