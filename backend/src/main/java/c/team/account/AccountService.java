package c.team.account;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class AccountService {

    public Optional<UserDetails> findUser(String username) {
        return Optional.of(new User(username, "password", Collections.emptyList()));
    }

}
