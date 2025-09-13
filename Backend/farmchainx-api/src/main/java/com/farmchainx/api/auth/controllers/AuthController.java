package com.farmchainx.api.auth.controllers;

import com.farmchainx.api.auth.dto.*;
import com.farmchainx.api.auth.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
/*import org.springframework.security.core.annotation.AuthenticationPrincipal;*/
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final AuthService service;
  public AuthController(AuthService service) { this.service = service; }

  @PostMapping("/signup")
  public ResponseEntity<Map<String,String>> signup(@RequestBody @Valid SignUpRequest req) {
    service.signup(req);
    return ResponseEntity.ok(Map.of("message","Registered successfully"));
  }

  @PostMapping("/signin")
  public ResponseEntity<AuthResponse> signin(@RequestBody @Valid SignInRequest req) {
    return ResponseEntity.ok(service.signin(req));
  }

  @PostMapping("/refresh")
  public ResponseEntity<AuthResponse> refresh(@RequestBody @Valid RefreshRequest req) {
    return ResponseEntity.ok(service.refresh(req));
  }

  @GetMapping("/me")
  public ResponseEntity<Map<String,Object>> me(Authentication authentication) {
    String email = authentication.getName();
    return ResponseEntity.ok(service.me(email));


  }
}
