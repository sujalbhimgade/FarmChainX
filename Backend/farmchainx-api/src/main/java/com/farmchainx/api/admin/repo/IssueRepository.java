// com/farmchainx/api/admin/repo/IssueRepository.java
package com.farmchainx.api.admin.repo;
import com.farmchainx.api.admin.entities.Issue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IssueRepository extends JpaRepository<Issue, Long> {}
