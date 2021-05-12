package c.team.session.statistics.model.timeline;

import io.swagger.v3.oas.annotations.Parameter;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class TimelineRequest {

    @NotBlank
    @Parameter(required = true)
    private String username;

    @NotBlank
    @Parameter(required = true)
    private String sessionId;
}
