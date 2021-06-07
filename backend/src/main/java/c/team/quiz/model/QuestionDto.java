package c.team.quiz.model;

import com.mongodb.lang.Nullable;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
@Document
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDto {
    private String id;
    @Parameter(required = true)
    @NotBlank
    private String content;
    @Parameter(required = true)
    private boolean open;
    @Valid
    @Nullable
    private List<Answer> answers;

    public Question toQuestion(String quizId) {
        return Question.builder()
                .id(id)
                .quizId(quizId)
                .open(open)
                .answers(answers)
                .content(content)
                .build();
    }
}
