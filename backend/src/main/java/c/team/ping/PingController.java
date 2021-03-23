package c.team.ping;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("ping")
public class PingController {
    @GetMapping
    public ResponseEntity<String> ping() {  // Tutaj powinna pojawic sie jaka zmiana
        return ResponseEntity.ok("elo");
    }
}
