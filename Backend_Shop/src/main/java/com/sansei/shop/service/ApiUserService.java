package com.sansei.shop.service;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder; 
import org.springframework.stereotype.Service;
import com.sansei.shop.model.ApiUser;
import com.sansei.shop.model.Cart;
import com.sansei.shop.model.OrderItem;
import com.sansei.shop.model.UserOrder;
import com.sansei.shop.repository.ApiUserRepository;
import com.sansei.shop.repository.CartRepository;
import com.sansei.shop.repository.UserOrderRepository;
import com.sansei.shop.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class ApiUserService {

    private final ApiUserRepository apiUserRepository;
    private final PasswordEncoder passwordEncoder; 
    private final JwtUtil jwtUtil;
    private final CartRepository cartRepository;
    private final UserOrderRepository userOrderRepository;

    @Autowired
    public ApiUserService(ApiUserRepository apiUserRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, CartRepository cartRepository, ProductService productService, UserOrderRepository userOrderRepository) {
        this.apiUserRepository = apiUserRepository;
        this.passwordEncoder = passwordEncoder; 
        this.jwtUtil = jwtUtil;
        this.cartRepository = cartRepository;
        this.userOrderRepository = userOrderRepository;
    }

    public ApiUser findByUsername(String username) {
        return apiUserRepository.findByUsername(username);
    }

    public void createDefaultAdmin() {
        if (apiUserRepository.count() == 0) {
            ApiUser adminUser = new ApiUser("admin", "admin123","admin@example.com","123-456-7890","123 Main St" );
            adminUser.setUsername("admin");
            adminUser.setPassword(passwordEncoder.encode(adminUser.getPassword()));
            adminUser.setRole("ADMIN");
            apiUserRepository.save(adminUser);
        }
    }

    public boolean validatePassword(ApiUser user, String password) {
        return passwordEncoder.matches(password, user.getPassword()); 
    }

    public String extractToken(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7); 
        }
        return null;
    }

    public ApiUser currentUser(HttpServletRequest request) {
        String token = extractToken(request);
        if (token != null) {
            String username = jwtUtil.extractUsername(token);
            return apiUserRepository.findByUsername(username);
        } else {
            return null;
        }
    }

    public void save(ApiUser user) {
        // Encode the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        apiUserRepository.save(user);
    }

    public Cart getCart(HttpServletRequest request) {
        ApiUser user = currentUser(request);
        if (user == null){
            throw new RuntimeException("User not found");
        } else {
            Cart cart = cartRepository.findByUser(user);
            if (cart==null){
                cart = new Cart();
                cart.setUser(user);
                cartRepository.save(cart);
                return cart;
            } else {
                return cart;
            }
        }
    }

    public void saveCart(HttpServletRequest request, Cart cart) {
        ApiUser user = currentUser(request);
        if (user != null) {
            cartRepository.save(cart);
        }
    }
    
    public String orderCart(HttpServletRequest request) {
        ApiUser  user = currentUser (request);
        if (user == null) {
            return "Access denied"; 
        }

        Cart cart = getCart(request);
        if (cart == null || cart.getCartItems().isEmpty()) {
            return "Cart is empty"; 
        }

        UserOrder order = new UserOrder();
        order.setUser(user);
        order.setOrderStatus("Pending");
        order.setOrderDate(new Date().toString());
        order.setOrderTotal(calculateTotal(cart)); 
        order.setOrderAddress(user.getCurrentAddress());
        order.setOrderPhone(user.getPhone());
        order.setPaymentMethod("unPaid");
        List<OrderItem> orderItems = cart.getCartItems().stream()
                .map(cartItem -> {
                    OrderItem orderItem = new OrderItem(order,cartItem.getProduct(),cartItem.getQuantity(),cartItem.getProduct().getPrice());
                    return orderItem;
                })
                .collect(Collectors.toList());
        order.setOrderItems(orderItems);
        userOrderRepository.save(order);
        cart.clearCartItems();
        cartRepository.save(cart);
        return "Order placed successfully";
    }

    public double calculateTotal(Cart cart) {
        return cart.getCartItems().stream()
                .mapToDouble(cartItem -> cartItem.getProduct().getPrice() * cartItem.getQuantity())
                .sum();
            }

    public List<UserOrder> getOrders(HttpServletRequest request) {
        ApiUser user = currentUser(request);
        if (user != null) {
            return userOrderRepository.findByUser(user);
        } else {
            return Collections.emptyList();
        }
    }

    public UserOrder getOrder(HttpServletRequest request, Long oid) {
        ApiUser user = currentUser(request);
        if (user != null) {
            return userOrderRepository.findById(oid).orElse(null);
        } else {
            return null;
        }
    }
    public List<ApiUser> findAllAdmins() {
        return apiUserRepository.findByRole("ADMIN"); // Assuming your repository has this method
    }

}
