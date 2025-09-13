package com.farmchainx.api.auth.dto;

import java.util.Set;

public record AuthResponse(
  String accessToken,
  String refreshToken,
  String tokenType,
  String fullName,
  String email,
  Set<String> roles
) {
  public static AuthResponse of(String access, String refresh, String fullName, String email, Set<String> roles) {
    return new AuthResponse(access, refresh, "Bearer", fullName, email, roles);
  }
}
