package com.farmchainx.api.auth.services;

import com.farmchainx.api.auth.dto.*;
import com.farmchainx.api.auth.entities.*;
import com.farmchainx.api.auth.repo.*;
import com.farmchainx.api.auth.jwt.JwtService;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AuthService {
  private final UserRepository userRepo;
  private final RoleRepository roleRepo;
  private final PasswordEncoder encoder;
  private final AuthenticationManager authManager;
  private final JwtService jwtService;

  public AuthService(UserRepository userRepo, RoleRepository roleRepo,
                     PasswordEncoder encoder, AuthenticationManager authManager,
                     JwtService jwtService) {
    this.userRepo = userRepo;
    this.roleRepo = roleRepo;
    this.encoder = encoder;
    this.authManager = authManager;
    this.jwtService = jwtService;
  }

  @Transactional
  public void signup(SignUpRequest req) {
    if (userRepo.existsByEmail(req.email())) {
      throw new IllegalArgumentException("Email already registered");
    }
    Set<Role> roles = req.roles().stream()
      .map(String::toUpperCase)
      .map(RoleName::valueOf)
      .map(rn -> roleRepo.findByName(rn).orElseGet(() -> roleRepo.save(Role.builder().name(rn).build())))
      .collect(Collectors.toSet());

    var user = User.builder()
      .fullName(req.fullName())            
      .email(req.email())
      .mobile(req.mobile())
      .password(encoder.encode(req.password()))
      .roles(roles)
      .build();
    userRepo.save(user);
  }

  public AuthResponse signin(SignInRequest req) {
    Authentication auth = authManager.authenticate(
        new UsernamePasswordAuthenticationToken(req.email(), req.password()));
    String email = auth.getName();
    var user = userRepo.findByEmail(email).orElseThrow();
    var roleStrings = user.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toSet());
    String access = jwtService.generateAccessToken(email, roleStrings);
    String refresh = jwtService.generateRefreshToken(email);
    return AuthResponse.of(access, refresh, user.getFullName(), user.getEmail(), roleStrings); // fullName
  }

  public AuthResponse refresh(RefreshRequest req) {
    if (!jwtService.isValid(req.refreshToken())) throw new BadCredentialsException("Invalid refresh token");
    String email = jwtService.getSubject(req.refreshToken());
    var user = userRepo.findByEmail(email).orElseThrow();
    var roleStrings = user.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toSet());
    String newAccess = jwtService.generateAccessToken(email, roleStrings);
    String newRefresh = jwtService.generateRefreshToken(email);
    return AuthResponse.of(newAccess, newRefresh, user.getFullName(), user.getEmail(), roleStrings); // fullName
  }

  public Map<String,Object> me(String email) {
    var user = userRepo.findByEmail(email).orElseThrow();
    return Map.of(
      "fullName", user.getFullName(),       // fullName in response
      "email", user.getEmail(),
      "mobile", user.getMobile(),
      "roles", user.getRoles().stream().map(r -> r.getName().name()).toList()
    );
  }
}
