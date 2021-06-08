package c.team.session.administration.model;

import io.swagger.v3.oas.annotations.Parameter;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class SessionCreateRequest {
    @NotBlank
    @Parameter(required = true)
    private String sessionTitle;

    @Parameter(required = true)
    private boolean guestApproval;
}
