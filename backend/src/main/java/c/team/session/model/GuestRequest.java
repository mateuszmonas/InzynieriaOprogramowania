package c.team.session.model;

import io.swagger.v3.oas.annotations.Parameter;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class GuestRequest {

    @NotBlank
    @Parameter(required = true)
    private String username;

    @NotBlank
    @Parameter(required = true)
    private String passcode;

}
