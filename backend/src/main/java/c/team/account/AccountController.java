package c.team.account;

import c.team.token.TokenService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class AccountController {

    private final AccountService accountService;
    private final TokenService tokenService;

    @RequestMapping("/login/{login}")
    public ResponseEntity<String> login(@PathVariable String login) {
        if (accountService.findUser(login).isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(tokenService.generateTokenForLogin(login));
    }
}
