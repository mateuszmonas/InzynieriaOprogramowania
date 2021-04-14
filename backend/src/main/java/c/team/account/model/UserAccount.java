package c.team.account.model;


import c.team.security.model.UserPrincipal;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@Document
public class UserAccount {
    @Id
    private String id;
    @Indexed(unique = true)
    private String username;
    private String password;

    public UserPrincipal toUserPrincipal() {
        return new UserPrincipal(id, username, password);
    }
}