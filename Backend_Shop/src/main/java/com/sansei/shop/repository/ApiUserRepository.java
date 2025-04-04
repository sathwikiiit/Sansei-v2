package com.sansei.shop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.sansei.shop.model.ApiUser;

@Repository
public interface ApiUserRepository extends JpaRepository<ApiUser, Long> {
    ApiUser findByUsername(String username);
    List<ApiUser> findByRole(String role);
}
