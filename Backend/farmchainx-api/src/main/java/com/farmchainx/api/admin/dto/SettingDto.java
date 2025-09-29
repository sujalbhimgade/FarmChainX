// com/farmchainx/api/admin/dto/SettingDto.java
package com.farmchainx.api.admin.dto;
import jakarta.validation.constraints.*;

public record SettingDto(
  Long id,
  @NotBlank String configKey,
  @NotBlank String configValue,
  @NotBlank String category,     // platform|financial|security|business_rules|support
  String description
) {}
