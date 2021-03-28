package c.team.session.model;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
@Builder
public class Guest {
    @Id
    private String id;
    private String username;
}
