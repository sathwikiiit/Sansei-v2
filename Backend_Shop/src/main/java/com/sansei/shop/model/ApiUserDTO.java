package com.sansei.shop.model;

public class ApiUserDTO {
    private String username;
    private String email;
    private String phone;

    public ApiUserDTO() {
    }
    public ApiUserDTO(ApiUser user) {
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.phone = user.getPhone();
    }

    // Getters
    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    // Setters (optional, depending on use case)
    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
