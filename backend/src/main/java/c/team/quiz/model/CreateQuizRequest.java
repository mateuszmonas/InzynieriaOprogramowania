package c.team.quiz.model;

import io.swagger.v3.oas.annotations.Parameter;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import java.util.List;

@Data
@NoArgsConstructor
public class CreateQuizRequest {
    @NotEmpty
    @Valid
    @Parameter(required = true)
    private List<QuestionDto> questions;
}
