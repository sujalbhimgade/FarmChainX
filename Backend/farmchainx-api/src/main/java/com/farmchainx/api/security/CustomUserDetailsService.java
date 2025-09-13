package com.farmchainx.api.security;

import com.farmchainx.api.auth.entities.User;
import com.farmchainx.api.auth.repo.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {
  private final UserRepository repo;
  public CustomUserDetailsService(UserRepository repo) { this.repo = repo; }

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    User u = repo.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    Set<GrantedAuthority> auths = u.getRoles().stream()
      .map(r -> new SimpleGrantedAuthority("ROLE_" + r.getName().name()))
      .collect(Collectors.toSet());
    return new org.springframework.security.core.userdetails.User(u.getEmail(), u.getPassword(), auths);
  }
}
