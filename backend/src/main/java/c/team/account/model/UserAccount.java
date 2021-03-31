package c.team.account.model;


import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.userdetails.User;

import java.util.Collections;

@Data
@Builder
@Document
public class UserAccount {
    @Id
    private String id;
    @Indexed(unique = true)
    private String username;
    private String password;

    public User toUser() {
        return new User(username, password, Collections.emptyList());
    }
}