package com.sansei.shop.service;

import java.io.InputStream;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sansei.shop.model.Product;
import com.sansei.shop.model.ProductDTO;
import com.sansei.shop.model.UserOrder;
import com.sansei.shop.repository.ProductRepository;
import com.sansei.shop.repository.UserOrderRepository;

import jakarta.transaction.Transactional;

@Service
public class AdminService {

    private final ProductRepository productRepository;
    private final UserOrderRepository userOrderRepository;
    private final ResourceLoader resourceLoader; // Add ResourceLoader
    private final ObjectMapper objectMapper = new ObjectMapper(); // Add ObjectMapper

    @Autowired
    public AdminService(ProductRepository productRepository, UserOrderRepository userOrderRepository,ResourceLoader resourceLoader) { // Add to constructor
        this.productRepository = productRepository;
        this.userOrderRepository = userOrderRepository;
        this.resourceLoader = resourceLoader;
    }

    public void addProduct(ProductDTO product) {
        Product productEntity = new Product();
        productEntity.setName(product.getName());
        productEntity.setPrice(product.getPrice());
        productEntity.setDescription(product.getDescription());
        productEntity.setCategory(product.getCategory());
        productEntity.setStock(product.getStock());
        productEntity.setTags(product.getTags());
        productRepository.save(productEntity);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public void updateProduct(Long Id, ProductDTO product) {
        Product productEntity = productRepository.findById(Id).orElse(null);
        if (productEntity == null) {
            return;
        }
        if (product.getName() != null) {
            productEntity.setName(product.getName());
        }
        if (product.getDescription() != null) {
            productEntity.setDescription(product.getDescription());
        }
        if (product.getPrice() != 0) {
            productEntity.setPrice(product.getPrice());
        }
        if (product.getStock() != 0) {
            productEntity.setStock(product.getStock());
        }
        productRepository.save(productEntity);

    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public void restockProduct(Long pid, int quantity) {
        Product product = productRepository.findById(pid).orElse(null);
        if (product != null) {
            product.setStock(product.getStock() + quantity);
            productRepository.save(product);
        } else {
            throw new RuntimeException("Product not found");
        }
    }

    public List<UserOrder> getPendingOrders() {
        return userOrderRepository.findAllByOrderStatus("Pending");
    }

    public void confirmOrder(Long oid, String date, String paymentMethod) {
        UserOrder order = userOrderRepository.findById(oid).orElse(null);
        
        if (order != null) {
            order.getOrderItems().forEach((orderItem)->{
                Optional<Product> product = productRepository.findById(orderItem.getProduct().getId());
                product.ifPresent((prod)->{
                    prod.setStock(prod.getStock()-orderItem.getQuantity());
                    this.productRepository.save(prod);
                });
                
            });
            order.setOrderStatus("confirmed");
            order.setDeliveryDate(date);
            order.setPaymentMethod("Paid by "+paymentMethod);
            userOrderRepository.save(order);
        } else {
            throw new RuntimeException("Order not found");
        }
    }

    @Transactional
    public void addMultipleProducts(Product[] products) {
        for (Product product : products) {
            List<Product> existingProducts = productRepository.findByNameIgnoreCase(product.getName());
            Product productToUpdate = null;

            if (!existingProducts.isEmpty()) {
                for (Product existingProduct : existingProducts) {
                    // Check if the existing product matches based on name and other attributes
                    if (existingProduct.getName().equalsIgnoreCase(product.getName()) &&
                            existingProduct.getCategory().equalsIgnoreCase(product.getCategory()) &&
                            existingProduct.getDescription().equals(product.getDescription())) { // Add more checks as
                                                                                                 // needed
                        productToUpdate = existingProduct;
                        break;
                    }
                }
            }

            if (productToUpdate != null) {
                restockProduct(productToUpdate.getId(), product.getStock());
            } else {
                productRepository.save(product);
            }
        }
    }
    public void addProductsFromJson(String jsonFilePath) {
        try {
            Resource resource = resourceLoader.getResource("classpath:" + jsonFilePath);
            InputStream inputStream = resource.getInputStream();
            Product[] products = objectMapper.readValue(inputStream, Product[].class); // Read JSON as Product array
            addMultipleProducts(products); // Use the existing addMultipleProducts method
        } catch (Exception e) {
            throw new RuntimeException("Error loading products from JSON: " + e.getMessage(), e); // Wrap for more context
        }
    }

    public List<UserOrder> getAllOrders() {
        return userOrderRepository.findAll();
    }
}
