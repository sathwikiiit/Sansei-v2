package com.sansei.shop.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sansei.shop.model.Product;


@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByCategoryAndTagsContainingIgnoreCaseAndNameContainingIgnoreCase(String category, String tags,
            String searchString, Pageable pageable);

    Page<Product> findByCategoryAndNameContainingIgnoreCase(String category, String searchString, Pageable pageable);

    Page<Product> findByTagsContainingIgnoreCaseAndNameContainingIgnoreCase(String tags, String searchString,
            Pageable pageable);

    Page<Product> findByCategoryAndTagsContainingIgnoreCase(String category, String tags, Pageable pageable);

    Page<Product> findByCategory(String category, Pageable pageable);

    Page<Product> findByTagsContainingIgnoreCase(String tags, Pageable pageable);

    Optional<Product> findById(int id);

    Page<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String searchString,String searchString2, Pageable pageable);

    @Query("SELECT COUNT(p) FROM Product p " +
           "WHERE (:category IS NULL OR p.category = :category) " +
           "AND (:tags IS NULL OR p.tags LIKE %:tags%) " +
           "AND (:searchString IS NULL OR p.name LIKE %:searchString% OR p.description LIKE %:searchString%)")
    long countProducts(
            @Param("category") String category,
            @Param("tags") String tags,
            @Param("searchString") String searchString
    );

    @Query("SELECT DISTINCT p.category FROM Product p")
    List<String> findDistinctCategories();

    List<Product> findByNameIgnoreCase(String name);

}
