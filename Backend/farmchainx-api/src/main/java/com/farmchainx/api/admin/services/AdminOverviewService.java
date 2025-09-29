// com/farmchainx/api/admin/services/AdminOverviewService.java
package com.farmchainx.api.admin.services;

import com.farmchainx.api.admin.dto.OverviewResponse;
import com.farmchainx.api.admin.repo.IssueRepository;
import com.farmchainx.api.admin.repo.SettingRepository;
import com.farmchainx.api.auth.repo.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminOverviewService {
  private final UserRepository users;
  private final IssueRepository issues;
  private final SettingRepository settings;

  public AdminOverviewService(UserRepository users, IssueRepository issues, SettingRepository settings) {
    this.users = users; this.issues = issues; this.settings = settings;
  }

  public OverviewResponse get() {
    long totalUsers = users.count();
    long pendingIssues = issues.findAll().stream().filter(i -> !"resolved".equalsIgnoreCase(i.getStatus())).count();
    long criticalIssues = issues.findAll().stream().filter(i -> "critical".equalsIgnoreCase(i.getSeverity()) || "high".equalsIgnoreCase(i.getSeverity())).count();
    long settingsCount = settings.count();
    long activeUsers = totalUsers; // adjust if you introduce status tracking on User
    return new OverviewResponse(totalUsers, activeUsers, pendingIssues, criticalIssues, settingsCount);
  }
}
