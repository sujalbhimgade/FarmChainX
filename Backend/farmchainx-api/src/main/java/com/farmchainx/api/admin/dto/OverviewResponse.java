// com/farmchainx/api/admin/dto/OverviewResponse.java
package com.farmchainx.api.admin.dto;

public record OverviewResponse(
  long totalUsers,
  long activeUsers,
  long pendingIssues,
  long criticalIssues,
  long settingsCount
) {}
