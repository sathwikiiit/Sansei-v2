package com.sansei.shop.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.sansei.shop.model.Product;
import com.sansei.shop.service.ProductService;

@Controller
@RequestMapping("api/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping("/all")
    public ResponseEntity<List<Product>> getProducts(){
        return ResponseEntity.ok( productService.getProducts());
    }

    @GetMapping("/{pId}")
    public ResponseEntity<Product> getProductById(@PathVariable Long pId){
        return ResponseEntity.ok(productService.getProduct(pId));
    }

    @GetMapping("/filter")
    public ResponseEntity<Map<String, Object>> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String tags,
            @RequestParam(required = false) String searchString,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Product> productPage = productService.getProducts(category, tags, searchString, page, size);

        Map<String, Object> response = new HashMap<>();
        response.put("products", productPage.getContent());
        response.put("totalProducts", productPage.getTotalElements());
        response.put("availableCategories", productService.getAllCategories());
        response.put("maxPageSize", productService.getMaxPageSize()); // Return the default max here

        return ResponseEntity.ok(response);
    }

}
