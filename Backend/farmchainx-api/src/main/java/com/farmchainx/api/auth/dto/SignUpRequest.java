package com.farmchainx.api.auth.dto;

import jakarta.validation.constraints.*;
import java.util.Set;

public record SignUpRequest(
  @NotBlank @Size(min=2, max=100) String fullName,
  @Email @NotBlank String email,
  @NotBlank @Size(min=6, max=100) String password,
  @Pattern(regexp="^[0-9]{10,15}$", message="mobile must be 10-15 digits") String mobile,
  @NotEmpty Set<String> roles
) {}
