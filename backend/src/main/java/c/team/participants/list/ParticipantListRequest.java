package c.team.participants.list;

import io.swagger.v3.oas.annotations.Parameter;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class ParticipantListRequest {
    // Only one at the time is used
    private String guestId;
    private String accountUsername;

    @NotBlank
    @Parameter(required = true)
    private String sessionId;
}
