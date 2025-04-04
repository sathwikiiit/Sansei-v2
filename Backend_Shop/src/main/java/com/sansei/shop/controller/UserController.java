package com.sansei.shop.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.sansei.shop.model.Address;
import com.sansei.shop.model.ApiUser;
import com.sansei.shop.model.ApiUserDTO;
import com.sansei.shop.model.Cart;
import com.sansei.shop.model.CartItem;
import com.sansei.shop.model.CartItemRequestDTO; // Create this DTO
import com.sansei.shop.model.ErrorResponse;
import com.sansei.shop.model.Product;
import com.sansei.shop.model.UserOrder;
import com.sansei.shop.repository.ProductRepository;
import com.sansei.shop.service.ApiUserService;

import jakarta.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("api/user")
public class UserController {
    private final ApiUserService apiUserService;
    private final ProductRepository productRepository;

    @Autowired
    public UserController(ApiUserService apiUserService , ProductRepository productRepository) {
        this.apiUserService = apiUserService;
        this.productRepository = productRepository;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> profile(HttpServletRequest request) {
        ApiUser user = apiUserService.currentUser(request);
        return user == null
                ? ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("Access denied"))
                : ResponseEntity.ok(new ApiUserDTO(user));
    }

    @GetMapping("/address")
    public ResponseEntity<List<Address>> address(HttpServletRequest request) {
        ApiUser user = apiUserService.currentUser(request);
        return user == null
                ? ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null)
                : ResponseEntity.ok(user.getAddresses());
    }

    @PostMapping ("/address/add")
    public ResponseEntity<Address> addAddress(HttpServletRequest request, @RequestBody Address address) {
        ApiUser user = apiUserService.currentUser(request);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        user.setAddress(address);
        return ResponseEntity.status(HttpStatus.CREATED).body(address);
    }

    @DeleteMapping ("/address/remove/{index}")
    public ResponseEntity<Void> removeAddress(HttpServletRequest request, @PathVariable int index) {
        ApiUser user = apiUserService.currentUser(request);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        user.removeAddress(index);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping ("/address/{index}")
    public ResponseEntity<Address> getAddress(HttpServletRequest request, @PathVariable int index) {
        ApiUser user = apiUserService.currentUser(request);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        return ResponseEntity.ok(user.getAddress(index));
    }

    @GetMapping("/cart")
    public ResponseEntity<Cart> getCart(HttpServletRequest request) {
        ApiUser user = apiUserService.currentUser(request);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        Cart cart = apiUserService.getCart(request);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/cart/remove")
    public ResponseEntity<String> removeProductFromCart(@RequestParam("productId") Long pid, HttpServletRequest request) {
        ApiUser user = apiUserService.currentUser(request);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You are not logged in");
        }
        Product product = productRepository.findById(pid).orElse(null);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }
        Cart cart= apiUserService.getCart(request);
        cart.getCartItems().removeIf(item -> item.getProduct().getId().equals(pid));
        apiUserService.saveCart(request, cart);
        return ResponseEntity.ok("Product removed from cart");
    }

    @PostMapping("/cart/items")
    public ResponseEntity<String> updateOrCreateCartItem(@RequestBody CartItemRequestDTO cartItemRequest, HttpServletRequest request) {
        ApiUser user = apiUserService.currentUser(request);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You are not logged in");
        }
    
        Product product = productRepository.findById(cartItemRequest.getProductId()).orElse(null);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }
    
        Cart cart = apiUserService.getCart(request);
        Long productId = cartItemRequest.getProductId();
        Integer quantity = cartItemRequest.getQuantity();
    
        Optional<CartItem> existingItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();
    
        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(quantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cart.getCartItems().add(newItem);
        }
    
        apiUserService.saveCart(request, cart);
        return ResponseEntity.ok("Cart updated successfully");
    }
    @PostMapping ("/order")
    public ResponseEntity<String> placeOrder(HttpServletRequest request) {
        ApiUser user = apiUserService.currentUser(request);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        Cart cart = apiUserService.getCart(request);
        if (cart.getCartItems().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cart is empty");
        }
        String orderConfirmation = apiUserService.orderCart(request);
        return ResponseEntity.ok(orderConfirmation); // Consider returning order details or ID
    }

    @GetMapping("/orders")
    public ResponseEntity<List<UserOrder>> getOrders(HttpServletRequest request) {
        ApiUser user = apiUserService.currentUser(request);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        return ResponseEntity.ok(apiUserService.getOrders(request));
    }

    @GetMapping ("/orders/{oid}")
    public ResponseEntity<UserOrder> getOrder(@PathVariable Long oid, HttpServletRequest request) {
        ApiUser user = apiUserService.currentUser(request);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        UserOrder order = apiUserService.getOrder(request, oid);
        return order.getUser().equals(user)
                ? ResponseEntity.ok(order)
                : ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
    }
}