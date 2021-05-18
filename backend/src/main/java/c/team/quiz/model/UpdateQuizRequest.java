package c.team.quiz.model;

import io.swagger.v3.oas.annotations.Parameter;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import java.util.List;

@Getter
@NoArgsConstructor
public class UpdateQuizRequest {    // Same content as CreateQuizRequest
    @NotEmpty
    @Valid
    @Parameter(required = true)
    private List<QuestionDto> questions;

    @NotEmpty
    @Parameter(required = true)
    private String name;
}
