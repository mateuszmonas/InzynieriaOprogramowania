package c.team.session.administration.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Guest {
    private String id;
    private String username;
    private boolean approved;
}
