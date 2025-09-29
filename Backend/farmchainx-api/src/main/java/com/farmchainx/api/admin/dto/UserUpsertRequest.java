// com/farmchainx/api/admin/dto/UserUpsertRequest.java
package com.farmchainx.api.admin.dto;
import jakarta.validation.constraints.*;

import java.util.Set;

public record UserUpsertRequest(
  @NotBlank String fullName,
  @Email @NotBlank String email,
  @Size(min = 8, max = 100) String password,
  String mobile,
  @NotNull Set<@NotBlank String> roles
) {}
