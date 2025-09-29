// com/farmchainx/api/admin/services/AdminIssueService.java
package com.farmchainx.api.admin.services;

import com.farmchainx.api.admin.dto.IssueDto;
import com.farmchainx.api.admin.entities.Issue;
import com.farmchainx.api.admin.repo.IssueRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AdminIssueService {
  private final IssueRepository issues;

  public AdminIssueService(IssueRepository issues) { this.issues = issues; }

  public Page<IssueDto> list(int page, int size) {
    var p = issues.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending()));
    return p.map(this::toDto);
  }

  public IssueDto create(IssueDto dto) {
    Issue i = toEntity(dto);
    i.setId(null);
    i.setCreatedAt(Instant.now());
    return toDto(issues.save(i));
  }

  public IssueDto updateStatus(Long id, String status) {
    Issue i = issues.findById(id).orElseThrow(() -> new EntityNotFoundException("Issue not found"));
    i.setStatus(status);
    return toDto(issues.save(i));
  }

  private IssueDto toDto(Issue i) {
    return new IssueDto(i.getId(), i.getTitle(), i.getType(), i.getSeverity(), i.getStatus(), i.getDescription(), i.getReportedBy());
  }
  private Issue toEntity(IssueDto d) {
    return Issue.builder().id(d.id()).title(d.title()).type(d.type()).severity(d.severity())
        .status(d.status()).description(d.description()).reportedBy(d.reportedBy()).build();
  }
}
