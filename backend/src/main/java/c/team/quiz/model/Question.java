package c.team.quiz.model;

import com.mongodb.lang.Nullable;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
@Document
@NoArgsConstructor
public class Question {
    @Id
    private String id;
    @Parameter(required = true)
    @NotBlank
    private String content;
    @Valid
    @Nullable
    private List<Answer> answers;
}
