package c.team.participants.list;

import io.swagger.v3.oas.annotations.Parameter;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class ParticipantListRequest {

    @NotBlank
    @Parameter(required = true)
    private String username;

    @NotBlank
    @Parameter(required = true)
    private String sessionTitle;

    @NotBlank
    @Parameter(required = true)
    private boolean guestApproval;
}
