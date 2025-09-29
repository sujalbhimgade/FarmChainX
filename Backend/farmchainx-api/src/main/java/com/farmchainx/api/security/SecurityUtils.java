package com.farmchainx.api.security;

import com.farmchainx.api.auth.entities.User;
import com.farmchainx.api.auth.repo.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

public final class SecurityUtils {
  private SecurityUtils() {}
  public static Optional<String> currentEmail() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || auth.getName() == null) return Optional.empty();
    return Optional.of(auth.getName());
  }
  public static Optional<User> currentUser(UserRepository users) {
    return currentEmail().flatMap(users::findByEmail);
  }
}
