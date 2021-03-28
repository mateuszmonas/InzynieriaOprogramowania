package c.team.account.model;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
@Builder
public class Guest extends User{
    @Id
    private String id;
    private String username;
}
