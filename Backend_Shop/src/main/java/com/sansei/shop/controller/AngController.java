package com.sansei.shop.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping
public class AngController {
    @GetMapping(value={"/login","/","/products","/profile","/cart","/orders","/orders/:orderId","/orders/:orderId/invoice","/admin","/admin/products","/admin/orders","/admin/users"})

    public String forward() {
        return "forward:/index.html";
    }
}
