package com.sansei.shop.controller;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.sansei.shop.model.ApiUser;
import com.sansei.shop.model.Cart;
import com.sansei.shop.model.Product;
import com.sansei.shop.model.ProductDTO;
import com.sansei.shop.model.UserOrder;
import com.sansei.shop.repository.CartRepository;
import com.sansei.shop.service.AdminService;
import com.sansei.shop.service.ApiUserService;

@Controller
@RequestMapping("api/admin/")
public class AdminController {
    private final AdminService adminService;
    private final ApiUserService apiUserService;
    private final CartRepository cartRepository;

    @Autowired
    public AdminController( AdminService adminService, ApiUserService apiUserService, CartRepository cartRepository ) {
        this.adminService = adminService;
        this.apiUserService = apiUserService;
        this.cartRepository = cartRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<List<ApiUser>> getAllUsers(){
        List<ApiUser> adminUsers = apiUserService.findAllAdmins(); // Assuming you have this method
        return ResponseEntity.ok(adminUsers);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody ApiUser  apiUser ) {
        try {
            ApiUser  existingUser  = apiUserService.findByUsername(apiUser .getUsername());
            if (existingUser  != null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");
            } else {
                apiUser .setRole("ADMIN");
                apiUserService.save(apiUser );
                Cart cart = new Cart();
                cart.setUser (apiUser );
                cartRepository.save(cart);
                return ResponseEntity.ok("User  created successfully");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + e.getMessage());
        }
    }

    @PostMapping("/products/remove")
    public ResponseEntity<String> removeProduct(@RequestParam Long id) {
        try {
            adminService.deleteProduct(id);
            return ResponseEntity.ok("Product removed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + e.getMessage());
        }
    }

    @PostMapping("/products/update")
    public ResponseEntity<String> updateProduct(@RequestParam Long id, @RequestBody ProductDTO product) {
        try {
            adminService.updateProduct(id, product);
            return ResponseEntity.ok("Product updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + e.getMessage());
        }
    }

    @PostMapping("/products/add")
    public ResponseEntity<String> addProduct(@RequestBody ProductDTO product) {
        adminService.addProduct(product);
        return ResponseEntity.ok("Product added successfully");
    }
    @PostMapping("/products/addJson")
    public ResponseEntity<?> addProductsbyJson(@RequestBody Product[] products) {
        for (Product product : products) {
            if (product.getId() != null) {
                return ResponseEntity.badRequest().body("Product ID should not be provided for new products.");
            }
            if (product.getName() == null || product.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Product name is required.");
            }
        }

        try {
            adminService.addMultipleProducts(products);
            return ResponseEntity.status(HttpStatus.CREATED).body("Products added successfully");
        } catch (Exception e) {
            // Log the error for debugging
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to add products. Please check server logs.");
        }
    }
    @GetMapping( "/products" )
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(adminService.getAllProducts());
    }

    @PutMapping ("/restock/{pid}")
    public ResponseEntity<String> restockProduct(@PathVariable Long pid, @RequestParam int quantity) {
        try {
            adminService.restockProduct(pid, quantity);
            return ResponseEntity.ok("Product restocked successfully + " + quantity);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + e.getMessage());
        }
    }

    @GetMapping ("/orders/Pending")
    public ResponseEntity<List<UserOrder>> getPendingOrders() {
        return ResponseEntity.ok(adminService.getPendingOrders());
    }

    @PutMapping ("/orders/confirm/{oid}")
    public ResponseEntity<String> confirmOrder(@PathVariable Long oid, @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) @RequestParam Date deliveryDate, @RequestParam String paymentMethod) {
        try {
            adminService.confirmOrder(oid, deliveryDate.toString(),paymentMethod);
            return ResponseEntity.ok("Order confirmed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + e.getMessage());
        }
    }
    @GetMapping("/orders")
    public ResponseEntity<List<UserOrder>> getAllOrders(){
        return ResponseEntity.ok(adminService.getAllOrders());
    }
}
