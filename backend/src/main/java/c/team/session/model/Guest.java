package c.team.session.model;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@Document
public class Guest {    // Not sure how it behaves with hashset
    @Id
    private String id;
    private String username;
}
