package c.team.token.model;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Data
@Builder
@Document
public class Token {
    @Id
    String id;
    String username;
    UUID value;
}
