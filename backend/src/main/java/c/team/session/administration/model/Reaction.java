package c.team.session.administration.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nonapi.io.github.classgraph.json.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.OffsetDateTime;

@Data
@Builder
@Document
@NoArgsConstructor
@AllArgsConstructor
public class Reaction {
    @Id
    private String id;
    private String sessionId;
    private OffsetDateTime timestamp;
    private String value;
}
