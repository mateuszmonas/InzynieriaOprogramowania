package c.team.ping;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("ping1")
public class PingTest1 {
    @GetMapping     // One mapping per class I guess
    public ResponseEntity<String> ping1() {
        return ResponseEntity.ok("ping pong");
    }
}
