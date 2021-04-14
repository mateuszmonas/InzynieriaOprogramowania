package c.team.security.model;

import lombok.Getter;
import org.springframework.security.core.userdetails.User;

import java.util.Collections;

@Getter
public class UserPrincipal extends User {
    String id;

    public UserPrincipal(String id, String username, String password) {
        super(username, password, Collections.emptyList());
        this.id = id;
    }
}
