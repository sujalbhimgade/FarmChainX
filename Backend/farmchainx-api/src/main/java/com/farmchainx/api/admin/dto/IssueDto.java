// com/farmchainx/api/admin/dto/IssueDto.java
package com.farmchainx.api.admin.dto;
import jakarta.validation.constraints.*;

public record IssueDto(
  Long id,
  @NotBlank String title,
  @NotBlank String type,         // e.g., payment_failure, quality_dispute
  @NotBlank String severity,     // low|medium|high|critical
  @NotBlank String status,       // pending_review|investigating|resolved|requires_action
  String description,
  String reportedBy
) {}
