package com.farmchainx.api.auth.dto;

import jakarta.validation.constraints.*;

public record SignInRequest(
  @Email @NotBlank String email,
  @NotBlank String password
) {}
