package com.sansei.shop;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.sansei.shop.service.AdminService;
import com.sansei.shop.service.ApiUserService;

@Component
public class DbInit implements CommandLineRunner {

    @Autowired
    private AdminService adminService;

    @Autowired
    private ApiUserService apiUserService;

    @Override
    public void run(String... args) throws Exception {
        // Specify the path to your JSON file here
        String jsonFilePath = "static/products.json";
        adminService.addProductsFromJson(jsonFilePath);
        apiUserService.createDefaultAdmin();
    }
}