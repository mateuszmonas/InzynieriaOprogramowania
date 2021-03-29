package c.team.account.model;

import io.swagger.v3.oas.annotations.Parameter;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class LoginRequest {

    @NotBlank
    @Parameter(required = true)
    private String username;

    @NotBlank
    @Parameter(required = true)
    private String password;
}
